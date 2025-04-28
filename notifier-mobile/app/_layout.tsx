import colorScheme from '@/assets/colorscheme';
import store from '@/state/defaultStore';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const baseTheme = MD3DarkTheme;

const theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    background: colorScheme.background,
    primary: colorScheme.primary,
    secondary: colorScheme.secondary,
    paperWhite: colorScheme.customWhite,
    laserBlue: colorScheme.tokyoLaserBlue,
    buttonStandard: colorScheme.standardButtonBg,
    placeholder: colorScheme.tokyoLaserBlueDulled,
  },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => theme;

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <GestureHandlerRootView>
            <Stack
              screenOptions={{
                headerShown: false,
                statusBarBackgroundColor: theme.colors.background,
              }}
            >
              <Stack.Screen name='(main)' />
            </Stack>
          </GestureHandlerRootView>
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
