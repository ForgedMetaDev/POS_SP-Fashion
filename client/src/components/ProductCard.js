import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { formatCurrency } from '../utils/formatCurrency';

const ProductCard = ({ product, onSelect, selected }) => (
  <Card mode={selected ? 'contained' : 'elevated'} style={styles.card}>
    <Card.Content>
      <Text variant="titleMedium">{product.name}</Text>
      <Text variant="bodyMedium">HSN: {product.hsnCode}</Text>
      <Text variant="bodyMedium">MRP: {formatCurrency(product.mrp)}</Text>
      <Text variant="bodySmall">GST: {product.gstRate}%</Text>
      <View style={styles.actionWrap}>
        <Button mode={selected ? 'contained-tonal' : 'contained'} onPress={() => onSelect(product)}>
          {selected ? 'Selected' : 'Select'}
        </Button>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 10
  },
  actionWrap: {
    marginTop: 10,
    alignItems: 'flex-start'
  }
});

export default ProductCard;
