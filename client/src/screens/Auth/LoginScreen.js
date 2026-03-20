import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Card, Snackbar, Text, TextInput } from 'react-native-paper';

import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login({ username: username.trim(), password });
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Worker Login
          </Text>
          <TextInput
            mode="outlined"
            label="Username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            contentStyle={styles.buttonContent}
          >
            Login
          </Button>
        </Card.Content>
      </Card>
      <Snackbar visible={Boolean(error)} onDismiss={() => setError('')} duration={3000}>
        {error}
      </Snackbar>
      <View style={styles.baseUrlWrap}>
        <Text variant="bodySmall">API: {process.env.EXPO_PUBLIC_API_URL}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
  },
  card: {
    borderRadius: 12
  },
  title: {
    marginBottom: 14
  },
  input: {
    marginBottom: 12
  },
  buttonContent: {
    minHeight: 50
  },
  baseUrlWrap: {
    marginTop: 8,
    alignItems: 'center'
  }
});

export default LoginScreen;
