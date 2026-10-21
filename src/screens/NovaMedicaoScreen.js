import { useEffect, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import Botao from '../components/Botao';
import { buscarAluno } from '../data/alunos';
import { atualizarMedicao, buscarMedicao, buscarMedicaoDoDia, salvarMedicao } from '../data/medicoes';
import { CORES } from '../theme/cores';
import { confirmar } from '../utils/confirmar';
import { formatarDataBr, hojeIso, mascararData, textoParaIso } from '../utils/datas';
import { avaliarImc, formatarNumero } from '../utils/imc';

export default function NovaMedicaoScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const alunoId = route.params.alunoId;
  const medicaoId = route.params.medicaoId;
  const editando = Boolean(medicaoId);

  const [data, setData] = useState(formatarDataBr(hojeIso()));
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregar() {
      if (editando) {
        const medicao = await buscarMedicao(db, medicaoId);
        if (medicao) {
          setData(formatarDataBr(medicao.data));
          setPeso(formatarNumero(medicao.peso, 1));
          setAltura(formatarNumero(medicao.altura, 2));
        }
        return;
      }

      const aluno = await buscarAluno(db, alunoId);
      if (!aluno) return;
      if (aluno.alturaPadrao) {
        setAltura(formatarNumero(aluno.alturaPadrao, 2));
      } else if (aluno.medicoes.length > 0) {
        const ultima = aluno.medicoes[aluno.medicoes.length - 1];
        setAltura(formatarNumero(ultima.altura, 2));
      }
    }

    carregar();
  }, [db, alunoId, medicaoId, editando]);

  const previa = peso && altura ? avaliarImc(peso, altura) : null;

  async function gravar(dataIso, resultado) {
    setSalvando(true);
    if (editando) {
      await atualizarMedicao(db, medicaoId, { data: dataIso, peso: resultado.peso, altura: resultado.altura });
    } else {
      await salvarMedicao(db, alunoId, { data: dataIso, peso: resultado.peso, altura: resultado.altura });
    }
    navigation.goBack();
  }

  async function salvar() {
    Keyboard.dismiss();
    setErro('');

    const dataIso = textoParaIso(data);
    if (!dataIso) {
      setErro('Informe a data no formato DD/MM/AAAA.');
      return;
    }
    if (dataIso > hojeIso()) {
      setErro('A data da medição não pode estar no futuro.');
      return;
    }

    const avaliacao = avaliarImc(peso, altura);
    if (avaliacao.erro) {
      setErro(avaliacao.erro);
      return;
    }

    const outra = await buscarMedicaoDoDia(db, alunoId, dataIso);
    if (outra && (!editando || outra.id !== medicaoId)) {
      if (editando) {
        setErro('Já existe uma medição nesse dia. Escolha outra data.');
        return;
      }
      confirmar(
        'Já existe uma medição nesse dia. Deseja substituí-la?',
        () => gravar(dataIso, avaliacao.resultado),
        'Substituir'
      );
      return;
    }

    await gravar(dataIso, avaliacao.resultado);
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.rotulo}>Data da medição</Text>
        <TextInput
          style={styles.campo}
          value={data}
          onChangeText={(texto) => setData(mascararData(texto))}
          placeholder="DD/MM/AAAA"
          placeholderTextColor={CORES.textoSecundario}
          keyboardType="number-pad"
          maxLength={10}
          accessibilityLabel="Data da medição"
        />

        <Text style={styles.rotulo}>Peso (kg)</Text>
        <TextInput
          style={styles.campo}
          value={peso}
          onChangeText={setPeso}
          placeholder="Ex.: 70,5"
          placeholderTextColor={CORES.textoSecundario}
          keyboardType="decimal-pad"
          accessibilityLabel="Peso em quilogramas"
        />

        <Text style={styles.rotulo}>Altura (m)</Text>
        <TextInput
          style={styles.campo}
          value={altura}
          onChangeText={setAltura}
          placeholder="Ex.: 1,75"
          placeholderTextColor={CORES.textoSecundario}
          keyboardType="decimal-pad"
          accessibilityLabel="Altura em metros"
        />

        {previa && previa.resultado ? (
          <View style={[styles.previa, { borderColor: previa.resultado.cor }]}>
            <Text style={styles.previaTexto}>
              IMC {formatarNumero(previa.resultado.imc, 1)} ·{' '}
              <Text style={{ color: previa.resultado.corTexto }}>{previa.resultado.classificacao}</Text>
            </Text>
          </View>
        ) : null}

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <Botao
          titulo={salvando ? 'Salvando...' : 'Salvar medição'}
          icone="save-outline"
          onPress={salvar}
          style={styles.botao}
        />
      </View>
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
  previa: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  previaTexto: {
    fontSize: 17,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  erro: {
    color: CORES.erro,
    fontSize: 14,
    marginBottom: 12,
  },
  botao: {
    marginTop: 8,
  },
});
