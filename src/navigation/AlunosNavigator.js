import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';

import AlunoDetalheScreen from '../screens/AlunoDetalheScreen';
import AlunosScreen from '../screens/AlunosScreen';
import CadastroAlunoScreen from '../screens/CadastroAlunoScreen';
import NovaMedicaoScreen from '../screens/NovaMedicaoScreen';
import { CORES } from '../theme/cores';

const Stack = createNativeStackNavigator();

const estiloCabecalho = {
  headerStyle: { backgroundColor: CORES.primaria },
  headerTintColor: CORES.branco,
  headerTitleStyle: { fontWeight: 'bold' },
};

function botaoMenu(navigation) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Abrir menu de navegação"
      hitSlop={10}
      onPress={() => navigation.getParent()?.openDrawer()}
    >
      <Ionicons name="menu" size={26} color={CORES.branco} />
    </Pressable>
  );
}

export default function AlunosNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AlunosLista"
      screenOptions={{ ...estiloCabecalho, headerBackButtonDisplayMode: 'minimal' }}
    >
      <Stack.Screen
        name="AlunosLista"
        component={AlunosScreen}
        options={({ navigation }) => ({
          title: 'Alunos',
          headerLeft: () => botaoMenu(navigation),
        })}
      />
      <Stack.Screen name="AlunoDetalhe" component={AlunoDetalheScreen} options={{ title: 'Aluno' }} />
      <Stack.Screen
        name="CadastroAluno"
        component={CadastroAlunoScreen}
        options={({ route }) => ({ title: route.params?.alunoId ? 'Editar aluno' : 'Novo aluno' })}
      />
      <Stack.Screen
        name="NovaMedicao"
        component={NovaMedicaoScreen}
        options={({ route }) => ({ title: route.params?.medicaoId ? 'Editar medição' : 'Nova medição' })}
      />
    </Stack.Navigator>
  );
}
