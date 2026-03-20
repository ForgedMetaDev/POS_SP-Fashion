import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card, Snackbar, Text, TextInput } from 'react-native-paper';

import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';

const SalesHistoryScreen = () => {
  const [date, setDate] = useState('');
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSales = useCallback(async (dateFilter = '') => {
    try {
      setLoading(true);
      setError('');

      let response;
      if (dateFilter?.trim()) {
        try {
          response = await axiosInstance.get('/sales', { params: { date: dateFilter.trim() } });
        } catch {
          response = await axiosInstance.get('/sales/by-date', { params: { date: dateFilter.trim() } });
        }
      } else {
        response = await axiosInstance.get('/sales');
      }

      setSales(response?.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to fetch sales history');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSales(date);
    }, [date, fetchSales])
  );

  const renderItem = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Text variant="titleSmall">Date: {new Date(item.createdAt).toLocaleString()}</Text>
        {item.items?.map((line, index) => (
          <View key={`${item._id}-${line.productId}-${index}`} style={styles.lineWrap}>
            <Text>{line.name}</Text>
            <Text>
              Qty: {line.quantity} | Price: {formatCurrency(line.sellingPrice)}
            </Text>
            <Text>
              GST: {formatCurrency(line.cgst + line.sgst)} | Final: {formatCurrency(line.lineFinalAmount)}
            </Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  return (
    <>
      <View style={styles.container}>
        <TextInput
          mode="outlined"
          label="Filter by date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          style={styles.filterInput}
          right={<TextInput.Icon icon="calendar" />}
        />

        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={sales}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            onRefresh={() => fetchSales(date)}
            refreshing={loading}
            ListEmptyComponent={<Text style={styles.emptyText}>No sales found</Text>}
          />
        )}
      </View>
      <Snackbar visible={Boolean(error)} onDismiss={() => setError('')} duration={3000}>
        {error}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  filterInput: {
    marginBottom: 12
  },
  list: {
    paddingBottom: 24
  },
  card: {
    marginBottom: 10
  },
  lineWrap: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20
  }
});

export default SalesHistoryScreen;
