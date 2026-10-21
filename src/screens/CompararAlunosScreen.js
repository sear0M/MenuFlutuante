import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import { listarAlunos } from '../data/alunos';
import { CORES } from '../theme/cores';
import { formatarVariacao, calcularEvolucao } from '../utils/evolucao';
import { formatarNumero } from '../utils/imc';

export default function CompararAlunosScreen() {
  const db = useSQLiteContext();
  const [alunos, setAlunos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);

  useFocusEffect(
    useCallback(() => {
      listarAlunos(db).then(setAlunos);
    }, [db])
  );

  function alternar(id) {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter((item) => item !== id));
    } else {
      setSelecionados([...selecionados, id]);
    }
  }

  const escolhidos = alunos.filter((aluno) => selecionados.includes(aluno.id));

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.ajuda}>
        Marque dois ou mais alunos para comparar a evolução de cada um. Cada aluno é comparado
        com o próprio histórico.
      </Text>

      {alunos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum aluno cadastrado ainda.</Text>
      ) : null}

      <View style={styles.lista}>
        {alunos.map((aluno) => {
          const marcado = selecionados.includes(aluno.id);
          return (
            <Pressable
              key={aluno.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: marcado }}
              onPress={() => alternar(aluno.id)}
              style={styles.item}
            >
              <Ionicons
                name={marcado ? 'checkbox' : 'square-outline'}
                size={24}
                color={CORES.primaria}
              />
              <Text style={styles.itemNome}>{aluno.nome}</Text>
            </Pressable>
          );
        })}
      </View>

      {escolhidos.length >= 2 ? (
        <View style={styles.tabela}>
          <Text style={styles.tituloTabela}>Comparação</Text>
          {escolhidos.map((aluno) => {
            const evolucao = calcularEvolucao(aluno.medicoes);
            return (
              <View key={aluno.id} style={styles.linhaAluno}>
                <Text style={styles.nomeAluno}>{aluno.nome}</Text>
                {evolucao ? (
                  <View>
                    <Text style={styles.detalhe}>
                      Peso inicial {formatarNumero(evolucao.pesoInicial, 1)} kg → atual{' '}
                      {formatarNumero(evolucao.pesoAtual, 1)} kg
                    </Text>
                    <Text style={styles.detalhe}>
                      Variação {formatarVariacao(evolucao.deltaKg)} kg ({formatarVariacao(evolucao.deltaPercentual)}%)
                    </Text>
                    <Text style={styles.detalhe}>Medições: {evolucao.totalMedicoes}</Text>
                  </View>
                ) : (
                  <Text style={styles.detalhe}>Sem medições ainda</Text>
                )}
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.vazio}>Selecione pelo menos dois alunos para ver a comparação.</Text>
      )}
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
  ajuda: {
    fontSize: 15,
    color: CORES.textoSecundario,
    lineHeight: 21,
    marginBottom: 16,
  },
  lista: {
    backgroundColor: CORES.superficie,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CORES.borda,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  itemNome: {
    fontSize: 16,
    color: CORES.texto,
    marginLeft: 12,
  },
  vazio: {
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginTop: 12,
  },
  tabela: {
    backgroundColor: CORES.superficie,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  tituloTabela: {
    fontSize: 17,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 8,
  },
  linhaAluno: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: CORES.borda,
  },
  nomeAluno: {
    fontSize: 16,
    fontWeight: '600',
    color: CORES.primaria,
    marginBottom: 4,
  },
  detalhe: {
    fontSize: 14,
    color: CORES.texto,
    marginTop: 2,
  },
});
