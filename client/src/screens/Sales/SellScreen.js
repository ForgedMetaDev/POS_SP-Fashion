import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Snackbar, Text, TextInput } from 'react-native-paper';

import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import ProductCard from '../../components/ProductCard';
import SaleForm from '../../components/SaleForm';
import { calculateGST } from '../../utils/gstCalculator';

const LAST_SEARCH_KEY = 'lastSearchedProducts';

const SellScreen = ({ navigation, route }) => {
  const [searchHsn, setSearchHsn] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [sellingPrice, setSellingPrice] = useState('');
  const [lastSearched, setLastSearched] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const debounceRef = useRef(null);

  const loadLastSearched = useCallback(async () => {
    const value = await AsyncStorage.getItem(LAST_SEARCH_KEY);
    if (!value) {
      return;
    }
    const parsed = JSON.parse(value);
    setLastSearched(Array.isArray(parsed) ? parsed : []);
  }, []);

  useEffect(() => {
    loadLastSearched();
  }, [loadLastSearched]);

  const fetchProducts = useCallback(async (hsnValue) => {
    if (!hsnValue?.trim()) {
      setSearchResults([]);
      setLoadingSearch(false);
      return;
    }

    try {
      setLoadingSearch(true);
      setError('');

      let response;
      try {
        response = await axiosInstance.get('/products/search', { params: { hsn: hsnValue.trim() } });
      } catch {
        response = await axiosInstance.get('/products/search/hsn', { params: { hsn: hsnValue.trim() } });
      }

      const products = response?.data?.data || [];
      setSearchResults(products);
      setLastSearched(products.slice(0, 5));
      await AsyncStorage.setItem(LAST_SEARCH_KEY, JSON.stringify(products.slice(0, 5)));
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to search products');
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  useEffect(() => {
    if (route.params?.scannedHsn) {
      setSearchHsn(route.params.scannedHsn);
      fetchProducts(route.params.scannedHsn);
    }
  }, [route.params?.scannedAt, route.params?.scannedHsn, fetchProducts]);

  const onSearchChange = (value) => {
    setSearchHsn(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchProducts(value);
    }, 350);
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setQuantity('1');
    setSellingPrice(String(product.mrp));
  };

  const totals = useMemo(() => {
    const qty = Number(quantity) || 0;
    const price = Number(sellingPrice) || 0;
    const amount = qty * price;

    if (!selectedProduct) {
      return calculateGST(0, 0);
    }

    return calculateGST(amount, selectedProduct.gstRate);
  }, [quantity, sellingPrice, selectedProduct]);

  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity('1');
    setSellingPrice('');
    setSearchHsn('');
    setSearchResults([]);
  };

  const submitSale = async () => {
    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }

    const qty = Number(quantity);
    const price = Number(sellingPrice);

    if (!qty || qty <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (!price || price <= 0) {
      setError('Selling price must be greater than 0');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await axiosInstance.post('/sales', {
        items: [
          {
            productId: selectedProduct._id,
            quantity: qty,
            sellingPrice: price
          }
        ]
      });
      setSuccess('Sale created successfully');
      resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create sale');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Sell Product
            </Text>
            <TextInput
              mode="outlined"
              label="Search by HSN"
              value={searchHsn}
              onChangeText={onSearchChange}
              style={styles.input}
            />
            <Button
              mode="contained-tonal"
              contentStyle={styles.buttonContent}
              onPress={() => navigation.navigate('Scanner')}
            >
              Scan Barcode
            </Button>
          </Card.Content>
        </Card>

        {loadingSearch ? <Loader style={styles.searchLoader} /> : null}

        {(searchResults.length ? searchResults : lastSearched).map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            selected={selectedProduct?._id === product._id}
            onSelect={selectProduct}
          />
        ))}

        {!searchResults.length && !loadingSearch && lastSearched.length ? (
          <View style={styles.lastWrap}>
            <Text variant="labelLarge">Showing last searched products</Text>
          </View>
        ) : null}

        {selectedProduct ? (
          <Card style={styles.productInfo} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium">{selectedProduct.name}</Text>
              <Text>MRP: ₹{selectedProduct.mrp}</Text>
              <Text>GST Rate: {selectedProduct.gstRate}%</Text>
            </Card.Content>
          </Card>
        ) : null}

        <SaleForm
          quantity={quantity}
          sellingPrice={sellingPrice}
          onChangeQuantity={setQuantity}
          onChangeSellingPrice={setSellingPrice}
          totals={totals}
          submitting={submitting}
          onSubmit={submitSale}
          disabled={!selectedProduct}
        />
      </ScrollView>

      <Snackbar visible={Boolean(error)} onDismiss={() => setError('')} duration={3000}>
        {error}
      </Snackbar>
      <Snackbar visible={Boolean(success)} onDismiss={() => setSuccess('')} duration={2500}>
        {success}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 16,
    paddingBottom: 32
  },
  card: {
    marginBottom: 12
  },
  title: {
    marginBottom: 10
  },
  input: {
    marginBottom: 10
  },
  buttonContent: {
    minHeight: 48
  },
  searchLoader: {
    paddingVertical: 12
  },
  lastWrap: {
    marginBottom: 8
  },
  productInfo: {
    marginTop: 8
  }
});

export default SellScreen;
