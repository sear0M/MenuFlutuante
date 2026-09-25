import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Botao from '../components/Botao';
import { useHistorico } from '../context/HistoricoContext';
import { CORES } from '../theme/cores';
import { formatarNumero } from '../utils/imc';

function formatarHora(data) {
  const doisDigitos = (n) => String(n).padStart(2, '0');
  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)} às ${doisDigitos(
    data.getHours()
  )}:${doisDigitos(data.getMinutes())}`;
}

function confirmar(mensagem, aoConfirmar) {
  if (Platform.OS === 'web') {
    if (window.confirm(mensagem)) aoConfirmar();
    return;
  }
  Alert.alert('Confirmação', mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Apagar', style: 'destructive', onPress: aoConfirmar },
  ]);
}

export default function HistoricoScreen({ navigation }) {
  const { historico, removerRegistro, limparHistorico } = useHistorico();

  if (historico.length === 0) {
    return (
      <View style={[styles.tela, styles.vazio]}>
        <Ionicons name="time-outline" size={64} color={CORES.borda} />
        <Text style={styles.vazioTitulo}>Nenhum cálculo ainda</Text>
        <Text style={styles.vazioTexto}>
          Os resultados calculados na tela "Calcular IMC" aparecem aqui.
        </Text>
        <Botao
          titulo="Calcular agora"
          icone="calculator-outline"
          onPress={() => navigation.navigate('CalcularImc')}
          style={styles.vazioBotao}
        />
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <Text style={styles.contador}>
            {historico.length} {historico.length === 1 ? 'cálculo realizado' : 'cálculos realizados'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.item, { borderLeftColor: item.cor }]}>
            <View style={styles.itemTextos}>
              <Text style={styles.itemImc}>
                IMC {formatarNumero(item.imc, 1)}{' '}
                <Text style={[styles.itemClassificacao, { color: item.corTexto }]}>
                  · {item.classificacao}
                </Text>
              </Text>
              <Text style={styles.itemDetalhe}>
                {formatarNumero(item.peso, 1)} kg · {formatarNumero(item.altura, 2)} m ·{' '}
                {formatarHora(item.data)}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Apagar este cálculo"
              hitSlop={10}
              onPress={() => confirmar('Apagar este cálculo do histórico?', () => removerRegistro(item.id))}
            >
              <Ionicons name="trash-outline" size={22} color={CORES.erro} />
            </Pressable>
          </View>
        )}
        ListFooterComponent={
          <Botao
            titulo="Limpar histórico"
            icone="trash-outline"
            variante="secundario"
            onPress={() => confirmar('Apagar todo o histórico de cálculos?', limparHistorico)}
            style={styles.limpar}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  lista: {
    padding: 20,
    paddingBottom: 40,
  },
  contador: {
    fontSize: 14,
    color: CORES.textoSecundario,
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.superficie,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 6,
  },
  itemTextos: {
    flex: 1,
    marginRight: 12,
  },
  itemImc: {
    fontSize: 17,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  itemClassificacao: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemDetalhe: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: 4,
  },
  limpar: {
    marginTop: 12,
  },
  vazio: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  vazioTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: 12,
  },
  vazioTexto: {
    fontSize: 15,
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 21,
  },
  vazioBotao: {
    marginTop: 20,
  },
});
