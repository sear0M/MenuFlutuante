import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import Botao from '../components/Botao';
import { listarAlunos } from '../data/alunos';
import { CORES } from '../theme/cores';
import { idadeEm } from '../utils/datas';
import { formatarNumero } from '../utils/imc';
import { formatarVariacao } from '../utils/evolucao';

export default function AlunosScreen({ navigation }) {
  const db = useSQLiteContext();
  const [alunos, setAlunos] = useState([]);
  const [busca, setBusca] = useState('');

  useFocusEffect(
    useCallback(() => {
      listarAlunos(db).then(setAlunos);
    }, [db])
  );

  const termo = busca.trim().toLowerCase();
  const filtrados = alunos.filter((aluno) => aluno.nome.toLowerCase().includes(termo));

  function resumoDoAluno(aluno) {
    const medicoes = aluno.medicoes;
    if (medicoes.length === 0) return 'Nenhuma medição ainda';
    const ultima = medicoes[medicoes.length - 1];
    const primeira = medicoes[0];
    if (medicoes.length === 1) {
      return `IMC ${formatarNumero(ultima.imc, 1)} · ${ultima.classificacao}`;
    }
    const variacao = formatarVariacao(ultima.peso - primeira.peso);
    return `IMC ${formatarNumero(ultima.imc, 1)} · ${variacao} kg desde a primeira medição`;
  }

  if (alunos.length === 0) {
    return (
      <View style={[styles.tela, styles.vazio]}>
        <Text style={styles.vazioTitulo}>Nenhum aluno cadastrado</Text>
        <Text style={styles.vazioTexto}>
          Cadastre um aluno para começar a registrar as medições dele.
        </Text>
        <Botao
          titulo="Cadastrar aluno"
          icone="person-add-outline"
          onPress={() => navigation.navigate('CadastroAluno')}
          style={styles.vazioBotao}
        />
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View>
            <TextInput
              style={styles.busca}
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar aluno pelo nome"
              placeholderTextColor={CORES.textoSecundario}
              accessibilityLabel="Buscar aluno pelo nome"
            />
            <Botao
              titulo="Novo aluno"
              icone="person-add-outline"
              onPress={() => navigation.navigate('CadastroAluno')}
              style={styles.novo}
            />
          </View>
        }
        ListEmptyComponent={<Text style={styles.semResultado}>Nenhum aluno com esse nome.</Text>}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('AlunoDetalhe', { alunoId: item.id })}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressionado]}
          >
            <View style={styles.cardTextos}>
              <Text style={styles.cardNome}>{item.nome}</Text>
              <Text style={styles.cardIdade}>{idadeEm(item.dataNascimento)} anos</Text>
              <Text style={styles.cardResumo}>{resumoDoAluno(item)}</Text>
            </View>
          </Pressable>
        )}
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
  busca: {
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: CORES.texto,
    backgroundColor: CORES.superficie,
    marginBottom: 12,
  },
  novo: {
    marginBottom: 16,
  },
  semResultado: {
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
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
  cardTextos: {
    flex: 1,
  },
  cardNome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  cardIdade: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
  cardResumo: {
    fontSize: 14,
    color: CORES.texto,
    marginTop: 6,
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
