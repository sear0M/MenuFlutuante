import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Botao from '../components/Botao';
import { CORES } from '../theme/cores';

const ATALHOS = [
  { rota: 'CalcularImc', titulo: 'Calcular IMC', descricao: 'Informe peso e altura', icone: 'calculator-outline' },
  { rota: 'Historico', titulo: 'Histórico', descricao: 'Veja os cálculos feitos', icone: 'time-outline' },
  { rota: 'TabelaImc', titulo: 'Tabela de IMC', descricao: 'Classificação da OMS', icone: 'list-outline' },
  { rota: 'Integrantes', titulo: 'Integrantes', descricao: 'Quem fez o aplicativo', icone: 'people-outline' },
];

const DICA_GESTO =
  Platform.OS === 'ios' ? ' ou arraste o dedo a partir da borda esquerda da tela' : '';

export default function InicioScreen({ navigation }) {
  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View style={styles.banner}>
        <Ionicons name="fitness" size={48} color={CORES.branco} />
        <Text style={styles.bannerTitulo}>Bem-vindo ao App IMC</Text>
        <Text style={styles.bannerTexto}>
          Calcule seu Índice de Massa Corporal e navegue entre as telas usando o menu flutuante.
        </Text>
      </View>

      <View style={styles.dica}>
        <Ionicons name="information-circle-outline" size={22} color={CORES.primaria} />
        <Text style={styles.dicaTexto}>
          Toque no ícone <Text style={styles.negrito}>☰</Text> no canto superior esquerdo
          {DICA_GESTO} para abrir o menu.
        </Text>
      </View>

      <Botao titulo="Abrir menu" icone="menu" onPress={() => navigation.openDrawer()} />

      <Text style={styles.secao}>Acesso rápido</Text>

      {ATALHOS.map((atalho) => (
        <Pressable
          key={atalho.rota}
          accessibilityRole="button"
          onPress={() => navigation.navigate(atalho.rota)}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressionado]}
        >
          <View style={styles.cardIcone}>
            <Ionicons name={atalho.icone} size={24} color={CORES.primaria} />
          </View>
          <View style={styles.cardTextos}>
            <Text style={styles.cardTitulo}>{atalho.titulo}</Text>
            <Text style={styles.cardDescricao}>{atalho.descricao}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={CORES.textoSecundario} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: CORES.primaria,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerTitulo: {
    color: CORES.branco,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  bannerTexto: {
    color: CORES.primariaClara,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 21,
  },
  dica: {
    flexDirection: 'row',
    backgroundColor: CORES.primariaClara,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  dicaTexto: {
    flex: 1,
    marginLeft: 10,
    color: CORES.texto,
    fontSize: 14,
    lineHeight: 20,
  },
  negrito: {
    fontWeight: 'bold',
  },
  secao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.superficie,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  cardPressionado: {
    backgroundColor: CORES.primariaClara,
  },
  cardIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CORES.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTextos: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: CORES.texto,
  },
  cardDescricao: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
});
