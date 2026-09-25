import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CORES } from '../theme/cores';
import { FAIXAS_IMC } from '../utils/imc';

export default function TabelaImcScreen() {
  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.descricao}>
        Classificação do IMC para adultos, segundo a Organização Mundial da Saúde (OMS).
      </Text>

      <View style={styles.tabela}>
        <View style={[styles.linha, styles.cabecalho]}>
          <Text style={[styles.celula, styles.textoCabecalho]}>IMC</Text>
          <Text style={[styles.celula, styles.textoCabecalho]}>Classificação</Text>
        </View>

        {FAIXAS_IMC.map((faixa, indice) => (
          <View
            key={faixa.classificacao}
            style={[styles.linha, indice % 2 === 1 && styles.linhaAlternada]}
          >
            <Text style={styles.celula}>{faixa.faixa}</Text>
            <View style={[styles.celula, styles.celulaClassificacao]}>
              <View style={[styles.marcador, { backgroundColor: faixa.cor }]} />
              <Text style={styles.textoClassificacao}>{faixa.classificacao}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.formulaTitulo}>Como é calculado?</Text>
      <View style={styles.formula}>
        <Text style={styles.formulaTexto}>IMC = peso ÷ (altura × altura)</Text>
        <Text style={styles.formulaExemplo}>Exemplo: 70 kg ÷ (1,75 × 1,75) = 22,9</Text>
      </View>

      <Text style={styles.aviso}>
        O IMC é apenas um indicador. Para uma avaliação completa, procure um profissional de saúde.
      </Text>
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
  descricao: {
    fontSize: 15,
    color: CORES.textoSecundario,
    marginBottom: 16,
    lineHeight: 21,
  },
  tabela: {
    backgroundColor: CORES.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    overflow: 'hidden',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  linhaAlternada: {
    backgroundColor: CORES.fundo,
  },
  cabecalho: {
    backgroundColor: CORES.primaria,
  },
  celula: {
    flex: 1,
    fontSize: 15,
    color: CORES.texto,
  },
  textoCabecalho: {
    color: CORES.branco,
    fontWeight: 'bold',
  },
  celulaClassificacao: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marcador: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  textoClassificacao: {
    flex: 1,
    fontSize: 15,
    color: CORES.texto,
    fontWeight: '600',
  },
  formulaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: 24,
    marginBottom: 10,
  },
  formula: {
    backgroundColor: CORES.primariaClara,
    borderRadius: 12,
    padding: 16,
  },
  formulaTexto: {
    fontSize: 17,
    fontWeight: '600',
    color: CORES.primariaEscura,
  },
  formulaExemplo: {
    fontSize: 14,
    color: CORES.texto,
    marginTop: 6,
  },
  aviso: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: 20,
    fontStyle: 'italic',
    lineHeight: 19,
  },
});
