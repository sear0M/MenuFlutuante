import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DrawerNavigator from './src/navigation/DrawerNavigator';
import { NOME_BANCO, prepararBanco } from './src/data/banco';
import { CORES } from './src/theme/cores';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Suspense
          fallback={
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: CORES.fundo }}>
              <ActivityIndicator size="large" color={CORES.primaria} />
            </View>
          }
        >
          <SQLiteProvider databaseName={NOME_BANCO} onInit={prepararBanco} useSuspense>
            <NavigationContainer>
              <DrawerNavigator />
            </NavigationContainer>
          </SQLiteProvider>
        </Suspense>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
