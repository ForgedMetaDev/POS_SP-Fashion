import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Card, Snackbar, Text } from 'react-native-paper';

import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const [metrics, setMetrics] = useState({
    todaySalesTotal: 0,
    monthlySalesTotal: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchMetrics = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      setError('');

      try {
        const analytics = await axiosInstance.get('/sales/analytics');
        setMetrics({
          todaySalesTotal: analytics?.data?.data?.todaySalesTotal || 0,
          monthlySalesTotal: analytics?.data?.data?.monthlySalesTotal || 0,
          totalOrders: analytics?.data?.data?.totalOrders || 0
        });
      } catch {
        const dashboard = await axiosInstance.get('/dashboard/metrics');
        setMetrics({
          todaySalesTotal: dashboard?.data?.data?.todaySalesTotal || 0,
          monthlySalesTotal: dashboard?.data?.data?.monthlySalesTotal || 0,
          totalOrders: dashboard?.data?.data?.totalOrders || 0
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load dashboard metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMetrics(true);
    }, [fetchMetrics])
  );

  const cards = useMemo(
    () => [
      { label: 'Today Sales', value: formatCurrency(metrics.todaySalesTotal) },
      { label: 'Monthly Sales', value: formatCurrency(metrics.monthlySalesTotal) },
      { label: 'Total Orders', value: String(metrics.totalOrders) }
    ],
    [metrics]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefreshing(true);
          fetchMetrics(false);
        }} />}
      >
        <Text variant="headlineSmall" style={styles.title}>
          Hello, {user?.fullName}
        </Text>

        {cards.map((card) => (
          <Card key={card.label} mode="elevated" style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{card.label}</Text>
              <Text variant="headlineSmall" style={styles.value}>
                {card.value}
              </Text>
            </Card.Content>
          </Card>
        ))}

        <View style={styles.actions}>
          <Button mode="contained" contentStyle={styles.button} onPress={() => navigation.navigate('Sell')}>
            Sell Product
          </Button>
          <Button
            mode="contained-tonal"
            contentStyle={styles.button}
            onPress={() => navigation.navigate('SalesHistory')}
          >
            Sales History
          </Button>
          <Button mode="outlined" contentStyle={styles.button} onPress={logout}>
            Logout
          </Button>
        </View>
      </ScrollView>
      <Snackbar visible={Boolean(error)} onDismiss={() => setError('')} duration={3000}>
        {error}
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
  title: {
    marginBottom: 14
  },
  card: {
    marginBottom: 12
  },
  value: {
    marginTop: 8
  },
  actions: {
    marginTop: 8,
    gap: 10
  },
  button: {
    minHeight: 52
  }
});

export default DashboardScreen;
