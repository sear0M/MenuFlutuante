import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import CustomDrawerContent from '../components/CustomDrawerContent';
import CalcularImcScreen from '../screens/CalcularImcScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import InicioScreen from '../screens/InicioScreen';
import IntegrantesScreen from '../screens/IntegrantesScreen';
import TabelaImcScreen from '../screens/TabelaImcScreen';
import { CORES } from '../theme/cores';

const Drawer = createDrawerNavigator();

// Cria a função de ícone do menu: ícone "cheio" quando a tela está ativa.
function icone(nome) {
  return ({ focused, color, size }) => (
    <Ionicons name={focused ? nome : `${nome}-outline`} size={size} color={color} />
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        // "front": o menu desliza por cima da tela, como um menu flutuante.
        drawerType: 'front',
        // Área maior para o gesto de arrastar, além da borda usada pelo "voltar" do Android.
        swipeEdgeWidth: 60,
        // Textos lidos pelo leitor de tela (o padrão da biblioteca é em inglês).
        headerLeft: (props) => (
          <DrawerToggleButton {...props} accessibilityLabel="Abrir menu de navegação" />
        ),
        overlayAccessibilityLabel: 'Fechar menu',
        headerStyle: { backgroundColor: CORES.primaria },
        headerTintColor: CORES.branco,
        headerTitleStyle: { fontWeight: 'bold' },
        drawerActiveTintColor: CORES.primaria,
        drawerActiveBackgroundColor: CORES.primariaClara,
        drawerInactiveTintColor: CORES.texto,
        drawerLabelStyle: { fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="Inicio"
        component={InicioScreen}
        options={{ title: 'Início', drawerIcon: icone('home') }}
      />
      <Drawer.Screen
        name="CalcularImc"
        component={CalcularImcScreen}
        options={{ title: 'Calcular IMC', drawerIcon: icone('calculator') }}
      />
      <Drawer.Screen
        name="Historico"
        component={HistoricoScreen}
        options={{ title: 'Histórico', drawerIcon: icone('time') }}
      />
      <Drawer.Screen
        name="TabelaImc"
        component={TabelaImcScreen}
        options={{ title: 'Tabela de IMC', drawerIcon: icone('list') }}
      />
      <Drawer.Screen
        name="Integrantes"
        component={IntegrantesScreen}
        options={{ title: 'Integrantes', drawerIcon: icone('people') }}
      />
    </Drawer.Navigator>
  );
}
