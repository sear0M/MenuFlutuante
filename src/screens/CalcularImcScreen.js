import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Botao from '../components/Botao';
import { useHistorico } from '../context/HistoricoContext';
import { CORES } from '../theme/cores';
import { avaliarImc, formatarNumero } from '../utils/imc';

export default function CalcularImcScreen({ navigation }) {
  const { adicionarRegistro } = useHistorico();
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const alturaRef = useRef(null);

  function calcular() {
    Keyboard.dismiss();
    const avaliacao = avaliarImc(peso, altura);

    if (avaliacao.erro) {
      setErro(avaliacao.erro);
      setResultado(null);
      return;
    }

    setErro('');
    setResultado(avaliacao.resultado);
    adicionarRegistro(avaliacao.resultado);
  }

  function limpar() {
    setPeso('');
    setAltura('');
    setResultado(null);
    setErro('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.descricao}>
          O IMC (Índice de Massa Corporal) é calculado dividindo o peso pela altura ao quadrado.
        </Text>

        <View style={styles.card}>
          <Text style={styles.rotulo}>Peso (kg)</Text>
          <TextInput
            style={styles.campo}
            value={peso}
            onChangeText={setPeso}
            placeholder="Ex.: 70,5"
            placeholderTextColor={CORES.textoSecundario}
            keyboardType="decimal-pad"
            returnKeyType="next"
            onSubmitEditing={() => alturaRef.current?.focus()}
            accessibilityLabel="Peso em quilogramas"
          />

          <Text style={styles.rotulo}>Altura (m)</Text>
          <TextInput
            ref={alturaRef}
            style={styles.campo}
            value={altura}
            onChangeText={setAltura}
            placeholder="Ex.: 1,75"
            placeholderTextColor={CORES.textoSecundario}
            keyboardType="decimal-pad"
            returnKeyType="done"
            onSubmitEditing={calcular}
            accessibilityLabel="Altura em metros"
          />

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <Botao titulo="Calcular" icone="calculator-outline" onPress={calcular} style={styles.botao} />
          <Botao titulo="Limpar" variante="secundario" onPress={limpar} style={styles.botao} />
        </View>

        {resultado ? (
          <View style={[styles.resultado, { borderColor: resultado.cor }]}>
            <Text style={styles.resultadoRotulo}>Seu IMC é</Text>
            <Text style={[styles.resultadoValor, { color: resultado.corTexto }]}>
              {formatarNumero(resultado.imc, 1)}
            </Text>
            <Text style={[styles.resultadoClassificacao, { color: resultado.corTexto }]}>
              {resultado.classificacao}
            </Text>
            <Text style={styles.resultadoDetalhe}>
              Peso {formatarNumero(resultado.peso, 1)} kg · Altura {formatarNumero(resultado.altura, 2)} m
            </Text>

            <View style={styles.acoes}>
              <Botao
                titulo="Ver tabela de IMC"
                variante="secundario"
                onPress={() => navigation.navigate('TabelaImc')}
              />
              <Botao
                titulo="Ver histórico"
                variante="secundario"
                onPress={() => navigation.navigate('Historico')}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    backgroundColor: CORES.superficie,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  rotulo: {
    fontSize: 15,
    fontWeight: '600',
    color: CORES.texto,
    marginBottom: 6,
  },
  campo: {
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    color: CORES.texto,
    backgroundColor: CORES.fundo,
    marginBottom: 16,
  },
  erro: {
    color: CORES.erro,
    fontSize: 14,
    marginBottom: 12,
  },
  botao: {
    marginTop: 8,
  },
  resultado: {
    marginTop: 20,
    backgroundColor: CORES.superficie,
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
  },
  resultadoRotulo: {
    fontSize: 16,
    color: CORES.textoSecundario,
  },
  resultadoValor: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  resultadoClassificacao: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultadoDetalhe: {
    fontSize: 14,
    color: CORES.textoSecundario,
    marginTop: 8,
  },
  acoes: {
    alignSelf: 'stretch',
    marginTop: 16,
    gap: 10,
  },
});
