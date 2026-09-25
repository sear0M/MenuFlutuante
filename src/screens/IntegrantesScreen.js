import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { INTEGRANTES } from '../constants/grupo';
import { CORES } from '../theme/cores';

// Iniciais do nome para o "avatar" (ex.: "Maria Souza" -> "MS").
function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export default function IntegrantesScreen() {
  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View style={styles.cabecalho}>
        <Ionicons name="people" size={40} color={CORES.primaria} />
        <Text style={styles.titulo}>Integrantes do grupo</Text>
        <Text style={styles.subtitulo}>
          Aplicativo desenvolvido com React Native e Menu Flutuante (Drawer) do React Navigation.
        </Text>
      </View>

      {INTEGRANTES.map((nome, indice) => (
        <View key={`${indice}-${nome}`} style={styles.item}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{iniciais(nome)}</Text>
          </View>
          <View style={styles.itemTextos}>
            <Text style={styles.nome}>{nome}</Text>
            <Text style={styles.papel}>Integrante {indice + 1}</Text>
          </View>
        </View>
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
  cabecalho: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.superficie,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: CORES.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarTexto: {
    color: CORES.branco,
    fontSize: 17,
    fontWeight: 'bold',
  },
  itemTextos: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: CORES.texto,
  },
  papel: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
});
