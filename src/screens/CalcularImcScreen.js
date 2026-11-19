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
import SeletorSexo from '../components/SeletorSexo';
import { CORES } from '../theme/cores';
import { estimarGordura, rotuloSexo } from '../utils/gordura';
import { avaliarImc, formatarNumero } from '../utils/imc';

export default function CalcularImcScreen({ navigation }) {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [sexo, setSexo] = useState(null);
  const [idade, setIdade] = useState('');
  const alturaRef = useRef(null);

  function calcular() {
    Keyboard.dismiss();
    const avaliacao = avaliarImc(peso, altura);

    if (avaliacao.erro) {
      setErro(avaliacao.erro);
      setResultado(null);
      return;
    }

    // Sexo e idade são opcionais: servem só para estimar a gordura corporal.
    let gordura = null;
    if (idade.trim() !== '') {
      const anos = Number(idade);
      if (!Number.isInteger(anos) || anos < 18 || anos > 120) {
        setErro('A idade deve ser um número inteiro entre 18 e 120 (ou deixe em branco).');
        setResultado(null);
        return;
      }
      gordura = estimarGordura(avaliacao.resultado.imc, anos, sexo);
    }

    setErro('');
    setResultado({ ...avaliacao.resultado, gordura, sexo, idade: idade.trim() });
  }

  function limpar() {
    setPeso('');
    setAltura('');
    setSexo(null);
    setIdade('');
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

          <Text style={styles.rotulo}>Sexo e idade — opcional</Text>
          <SeletorSexo valor={sexo} onChange={setSexo} style={styles.sexo} />
          <TextInput
            style={styles.campo}
            value={idade}
            onChangeText={setIdade}
            placeholder="Idade em anos (ex.: 30)"
            placeholderTextColor={CORES.textoSecundario}
            keyboardType="number-pad"
            maxLength={3}
            accessibilityLabel="Idade em anos"
          />
          <Text style={styles.ajuda}>
            O IMC é igual para homens e mulheres. Sexo e idade servem para estimar a gordura corporal.
          </Text>

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

            {resultado.gordura ? (
              <View style={styles.gordura}>
                <Text style={styles.gorduraTexto}>
                  Gordura estimada {formatarNumero(resultado.gordura.percentual, 1)}% ·{' '}
                  <Text style={{ color: resultado.gordura.corTexto }}>{resultado.gordura.classificacao}</Text>
                </Text>
                <Text style={styles.resultadoDetalhe}>
                  Faixa saudável ({rotuloSexo(resultado.sexo).toLowerCase()}, {resultado.idade} anos):{' '}
                  {resultado.gordura.faixaSaudavel}
                </Text>
              </View>
            ) : (
              <Text style={styles.dica}>Informe sexo e idade para ver também a gordura corporal estimada.</Text>
            )}

            <View style={styles.acoes}>
              <Botao
                titulo="Ver tabela de IMC"
                variante="secundario"
                onPress={() => navigation.navigate('TabelaImc')}
              />
              <Botao
                titulo="Ver alunos"
                variante="secundario"
                onPress={() => navigation.navigate('Alunos')}
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
  sexo: {
    marginBottom: 12,
  },
  ajuda: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: -8,
    marginBottom: 8,
  },
  gordura: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: CORES.borda,
  },
  gorduraTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  dica: {
    fontSize: 13,
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginTop: 10,
  },
  acoes: {
    alignSelf: 'stretch',
    marginTop: 16,
    gap: 10,
  },
});
