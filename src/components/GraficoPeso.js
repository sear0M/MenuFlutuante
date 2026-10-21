import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CORES } from '../theme/cores';
import { formatarDataBr } from '../utils/datas';
import { formatarNumero } from '../utils/imc';

const ALTURA_MAXIMA = 120;

export default function GraficoPeso({ medicoes }) {
  const maior = Math.max(...medicoes.map((medicao) => medicao.peso));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.area}>
      {medicoes.map((medicao) => (
        <View key={medicao.id} style={styles.coluna}>
          <Text style={styles.valor}>{formatarNumero(medicao.peso, 1)}</Text>
          <View style={[styles.barra, { height: (medicao.peso / maior) * ALTURA_MAXIMA }]} />
          <Text style={styles.data}>{formatarDataBr(medicao.data).slice(0, 5)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  area: {
    alignItems: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  coluna: {
    width: 56,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  valor: {
    fontSize: 12,
    color: CORES.texto,
    marginBottom: 4,
  },
  barra: {
    width: 28,
    backgroundColor: CORES.primaria,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  data: {
    fontSize: 12,
    color: CORES.textoSecundario,
    marginTop: 6,
  },
});
