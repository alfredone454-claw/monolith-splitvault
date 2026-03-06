/**
 * SplitVault - Solana Mobile Bill Splitting App
 * @format
 */
import React, {useEffect, useState} from 'react';
import {StatusBar, useColorScheme, View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider, MD3DarkTheme, MD3LightTheme} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import GroupScreen from './src/screens/GroupScreen';
import ExpenseScreen from './src/screens/ExpenseScreen';
import BalanceScreen from './src/screens/BalanceScreen';
import SettleScreen from './src/screens/SettleScreen';
import {SolanaProvider} from './src/context/SolanaProvider';
import {isWalletConnected, connectWallet} from './src/services/mwa';

const Stack = createNativeStackNavigator();

// Dark theme customization
const SplitVaultDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#9945FF', // Solana purple
    secondary: '#14F195', // Solana green
    background: '#0A0A0A',
    surface: '#1A1A1A',
  },
};

// Light theme customization
const SplitVaultLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#9945FF',
    secondary: '#14F195',
    background: '#FFFFFF',
    surface: '#F5F5F5',
  },
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? SplitVaultDarkTheme : SplitVaultLightTheme;
  const [isLoading, setIsLoading] = useState(true);
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const connected = isWalletConnected();
      setHasWallet(connected);
      setIsLoading(false);
    } catch (error) {
      console.log('Initial wallet check:', error);
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await connectWallet();
      setHasWallet(true);
      setIsLoading(false);
    } catch (error) {
      console.log('Wallet connection failed:', error);
      setHasWallet(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <View style={[styles.centered, {backgroundColor: theme.colors.background}]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, {color: theme.colors.onBackground}]}>
              Initializing SplitVault...
            </Text>
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <SolanaProvider>
          <NavigationContainer>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={theme.colors.background}
            />
            <Stack.Navigator
              initialRouteName="Groups"
              screenOptions={{
                headerStyle: {backgroundColor: theme.colors.surface},
                headerTintColor: theme.colors.primary,
                headerTitleStyle: {fontWeight: 'bold'},
                contentStyle: {backgroundColor: theme.colors.background},
              }}>
              <Stack.Screen
                name="Groups"
                component={GroupScreen}
                options={{title: 'SplitVault'}}
              />
              <Stack.Screen
                name="Expense"
                component={ExpenseScreen}
                options={{title: 'Add Expense'}}
              />
              <Stack.Screen
                name="Balance"
                component={BalanceScreen}
                options={{title: 'Balances'}}
              />
              <Stack.Screen
                name="Settle"
                component={SettleScreen}
                options={{title: 'Settle Up'}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SolanaProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default App;
