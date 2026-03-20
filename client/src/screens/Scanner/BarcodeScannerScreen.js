import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, Text } from 'react-native-paper';

const BarcodeScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    requestPermission();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) {
      return;
    }

    setScanned(true);
    navigation.navigate('Sell', {
      scannedHsn: data,
      scannedAt: Date.now()
    });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Camera permission is required for barcode scanning.</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
      <View style={styles.overlay}>
        <Text variant="titleMedium" style={styles.overlayText}>
          Scan HSN Barcode
        </Text>
        <Button mode="contained-tonal" onPress={() => navigation.goBack()}>
          Cancel
        </Button>
        {scanned ? (
          <Button style={styles.rescan} mode="contained" onPress={() => setScanned(false)}>
            Tap to Scan Again
          </Button>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  text: {
    textAlign: 'center',
    marginBottom: 12
  },
  overlay: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    alignItems: 'center',
    gap: 10
  },
  overlayText: {
    color: 'white',
    marginBottom: 8
  },
  rescan: {
    marginTop: 4
  }
});

export default BarcodeScannerScreen;
