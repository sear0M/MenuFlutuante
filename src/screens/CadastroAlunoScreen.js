import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';

import Botao from '../components/Botao';
import { buscarAluno, salvarAluno } from '../data/alunos';
import { CORES } from '../theme/cores';
import { formatarDataBr, hojeIso, idadeEm, mascararData, textoParaIso } from '../utils/datas';
import { converterNumero, formatarNumero } from '../utils/imc';

export default function CadastroAlunoScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const alunoId = route.params?.alunoId;
  const editando = Boolean(alunoId);

  const [nome, setNome] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [altura, setAltura] = useState('');
  const [consentimento, setConsentimento] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!editando) return;
    buscarAluno(db, alunoId).then((aluno) => {
      if (!aluno) return;
      setNome(aluno.nome);
      setNascimento(formatarDataBr(aluno.dataNascimento));
      if (aluno.alturaPadrao) setAltura(formatarNumero(aluno.alturaPadrao, 2));
    });
  }, [db, alunoId, editando]);

  async function salvar() {
    setErro('');

    if (nome.trim().length < 2) {
      setErro('Informe o nome do aluno.');
      return;
    }

    const dataIso = textoParaIso(nascimento);
    if (!dataIso) {
      setErro('Informe a data de nascimento no formato DD/MM/AAAA.');
      return;
    }
    if (dataIso > hojeIso()) {
      setErro('A data de nascimento não pode estar no futuro.');
      return;
    }
    if (idadeEm(dataIso) < 18) {
      setErro('Nesta versão o app cadastra somente alunos maiores de 18 anos.');
      return;
    }

    let alturaPadrao = null;
    if (altura.trim() !== '') {
      alturaPadrao = converterNumero(altura);
      if (Number.isNaN(alturaPadrao) || alturaPadrao < 0.4 || alturaPadrao > 2.6) {
        setErro('A altura padrão deve estar entre 0,40 e 2,60 m.');
        return;
      }
    }

    if (!editando && !consentimento) {
      setErro('Marque a confirmação de consentimento para continuar.');
      return;
    }

    const novoId = await salvarAluno(db, {
      id: alunoId,
      nome: nome.trim(),
      dataNascimento: dataIso,
      alturaPadrao,
    });

    if (editando) {
      navigation.goBack();
    } else {
      navigation.replace('AlunoDetalhe', { alunoId: novoId });
    }
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.rotulo}>Nome</Text>
        <TextInput
          style={styles.campo}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex.: Maria Silva"
          placeholderTextColor={CORES.textoSecundario}
          accessibilityLabel="Nome do aluno"
        />

        <Text style={styles.rotulo}>Data de nascimento</Text>
        <TextInput
          style={styles.campo}
          value={nascimento}
          onChangeText={(texto) => setNascimento(mascararData(texto))}
          placeholder="DD/MM/AAAA"
          placeholderTextColor={CORES.textoSecundario}
          keyboardType="number-pad"
          maxLength={10}
          accessibilityLabel="Data de nascimento"
        />

        <Text style={styles.rotulo}>Altura padrão (m) — opcional</Text>
        <TextInput
          style={styles.campo}
          value={altura}
          onChangeText={setAltura}
          placeholder="Ex.: 1,75"
          placeholderTextColor={CORES.textoSecundario}
          keyboardType="decimal-pad"
          accessibilityLabel="Altura padrão em metros"
        />
        <Text style={styles.ajuda}>
          Usada como sugestão nas próximas medições. Pode ser alterada em cada medição.
        </Text>

        {!editando ? (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: consentimento }}
            onPress={() => setConsentimento(!consentimento)}
            style={styles.consentimento}
          >
            <Ionicons
              name={consentimento ? 'checkbox' : 'square-outline'}
              size={24}
              color={CORES.primaria}
            />
            <Text style={styles.consentimentoTexto}>
              O aluno autorizou o registro dos seus dados (peso e altura) neste aplicativo.
            </Text>
          </Pressable>
        ) : null}

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <Botao titulo="Salvar" icone="save-outline" onPress={salvar} style={styles.botao} />
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
    fontSize: 16,
    color: CORES.texto,
    backgroundColor: CORES.fundo,
    marginBottom: 16,
  },
  ajuda: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: -10,
    marginBottom: 16,
  },
  consentimento: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  consentimentoTexto: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: CORES.texto,
    lineHeight: 20,
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
