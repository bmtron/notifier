import colorScheme from '@/assets/colorscheme';
import { View, Text } from 'react-native';

export default function MainView() {
  return (
    <View style={{ backgroundColor: colorScheme.background, flex: 1, height: '100%' }}>
      <Text style={{ color: colorScheme.tokyoLaserBlue }}>Hello from Main View</Text>
    </View>
  );
}
