import React from 'react';
import { StatusBar } from 'react-native'
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import { AuthProvider, useAuth } from './src/hooks/auth';
import { Routes } from './src/routes';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userStoredLoading } = useAuth();

  if (!fontsLoaded || userStoredLoading) {
    return (
    <AppLoading 
    />
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content"/>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  )
}

