import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';

import { formatCurrency } from '../utils/formatCurrency';

const SaleForm = ({
  quantity,
  sellingPrice,
  onChangeQuantity,
  onChangeSellingPrice,
  totals,
  submitting,
  onSubmit,
  disabled
}) => (
  <Card style={styles.card} mode="elevated">
    <Card.Content>
      <Text variant="titleMedium" style={styles.heading}>
        Sale Details
      </Text>
      <TextInput
        mode="outlined"
        label="Quantity"
        keyboardType="number-pad"
        value={String(quantity)}
        onChangeText={onChangeQuantity}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Selling Price"
        keyboardType="decimal-pad"
        value={String(sellingPrice)}
        onChangeText={onChangeSellingPrice}
        style={styles.input}
      />

      <View style={styles.row}>
        <Text>Total Amount</Text>
        <Text>{formatCurrency(totals.amount)}</Text>
      </View>
      <View style={styles.row}>
        <Text>CGST</Text>
        <Text>{formatCurrency(totals.cgst)}</Text>
      </View>
      <View style={styles.row}>
        <Text>SGST</Text>
        <Text>{formatCurrency(totals.sgst)}</Text>
      </View>
      <View style={styles.row}>
        <Text variant="titleMedium">Final Amount</Text>
        <Text variant="titleMedium">{formatCurrency(totals.finalAmount)}</Text>
      </View>

      <Button
        mode="contained"
        contentStyle={styles.buttonContent}
        style={styles.button}
        onPress={onSubmit}
        loading={submitting}
        disabled={disabled || submitting}
      >
        Submit Sale
      </Button>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    marginBottom: 18
  },
  heading: {
    marginBottom: 8
  },
  input: {
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  button: {
    marginTop: 8
  },
  buttonContent: {
    minHeight: 48
  }
});

export default SaleForm;
