import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const Loader = ({ size = 'large', style }) => (
  <View style={[{ paddingVertical: 24, alignItems: 'center', justifyContent: 'center' }, style]}>
    <ActivityIndicator animating size={size} />
  </View>
);

export default Loader;
