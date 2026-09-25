import { useEffect } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DrawerItemList, useDrawerStatus } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { INTEGRANTES } from '../constants/grupo';
import { CORES } from '../theme/cores';

export default function CustomDrawerContent(props) {
  const insets = useSafeAreaInsets();
  const statusMenu = useDrawerStatus();

  useEffect(() => {
    if (statusMenu === 'open') {
      Keyboard.dismiss();
    }
  }, [statusMenu]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.cabecalho, { paddingTop: insets.top + 24 }]}>
          <View style={styles.logo}>
            <Ionicons name="fitness" size={32} color={CORES.primaria} />
          </View>
          <Text style={styles.titulo}>App IMC</Text>
          <Text style={styles.subtitulo}>Menu de navegação</Text>
        </View>

        <View style={styles.itens}>
          <DrawerItemList {...props} />
        </View>
      </ScrollView>

      <View style={[styles.rodape, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.rodapeTitulo}>Desenvolvido por</Text>
        {INTEGRANTES.map((nome) => (
          <Text key={nome} style={styles.rodapeTexto}>
            {nome}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.superficie,
  },
  scroll: {
    paddingBottom: 12,
  },
  cabecalho: {
    backgroundColor: CORES.primaria,
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginBottom: 8,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CORES.branco,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titulo: {
    color: CORES.branco,
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: CORES.primariaClara,
    fontSize: 14,
    marginTop: 2,
  },
  itens: {
    paddingHorizontal: 12,
  },
  rodape: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CORES.borda,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  rodapeTitulo: {
    color: CORES.texto,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  rodapeTexto: {
    color: CORES.textoSecundario,
    fontSize: 13,
    lineHeight: 18,
  },
});
