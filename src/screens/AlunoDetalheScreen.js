import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import Botao from '../components/Botao';
import GraficoPeso from '../components/GraficoPeso';
import { buscarAluno, removerAluno } from '../data/alunos';
import { removerMedicao } from '../data/medicoes';
import { CORES } from '../theme/cores';
import { diasEntre, formatarDataBr, idadeEm } from '../utils/datas';
import { calcularEvolucao, formatarVariacao } from '../utils/evolucao';
import { confirmar } from '../utils/confirmar';
import { formatarNumero } from '../utils/imc';

export default function AlunoDetalheScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const alunoId = route.params.alunoId;
  const [aluno, setAluno] = useState(null);
  const [aba, setAba] = useState('medicoes');

  useFocusEffect(
    useCallback(() => {
      buscarAluno(db, alunoId).then((encontrado) => {
        if (encontrado) setAluno(encontrado);
      });
    }, [db, alunoId])
  );

  async function apagarMedicao(medicao) {
    await removerMedicao(db, medicao.id);
    setAluno(await buscarAluno(db, alunoId));
  }

  async function apagarAluno() {
    await removerAluno(db, alunoId);
    navigation.goBack();
  }

  if (!aluno) {
    return <View style={styles.tela} />;
  }

  const medicoesDecrescentes = [...aluno.medicoes].reverse();
  const evolucao = calcularEvolucao(aluno.medicoes);

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View style={styles.cabecalho}>
        <Text style={styles.nome}>{aluno.nome}</Text>
        <Text style={styles.info}>
          {idadeEm(aluno.dataNascimento)} anos · nascimento {formatarDataBr(aluno.dataNascimento)}
        </Text>
        {aluno.alturaPadrao ? (
          <Text style={styles.info}>Altura padrão {formatarNumero(aluno.alturaPadrao, 2)} m</Text>
        ) : null}
      </View>

      <View style={styles.abas}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: aba === 'medicoes' }}
          onPress={() => setAba('medicoes')}
          style={[styles.aba, aba === 'medicoes' && styles.abaAtiva]}
        >
          <Text style={[styles.abaTexto, aba === 'medicoes' && styles.abaTextoAtivo]}>Medições</Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: aba === 'evolucao' }}
          onPress={() => setAba('evolucao')}
          style={[styles.aba, aba === 'evolucao' && styles.abaAtiva]}
        >
          <Text style={[styles.abaTexto, aba === 'evolucao' && styles.abaTextoAtivo]}>Evolução</Text>
        </Pressable>
      </View>

      {aba === 'medicoes' ? (
        <View>
          <Botao
            titulo="Nova medição"
            icone="add-circle-outline"
            onPress={() => navigation.navigate('NovaMedicao', { alunoId })}
            style={styles.botaoAcao}
          />

          {medicoesDecrescentes.length === 0 ? (
            <Text style={styles.vazio}>Nenhuma medição ainda. Toque em "Nova medição".</Text>
          ) : null}

          {medicoesDecrescentes.map((medicao) => (
            <View key={medicao.id} style={[styles.item, { borderLeftColor: medicao.cor }]}>
              <View style={styles.itemTextos}>
                <Text style={styles.itemData}>{formatarDataBr(medicao.data)}</Text>
                <Text style={styles.itemDetalhe}>
                  {formatarNumero(medicao.peso, 1)} kg · {formatarNumero(medicao.altura, 2)} m · IMC{' '}
                  {formatarNumero(medicao.imc, 1)}
                </Text>
                <Text style={[styles.itemClassificacao, { color: medicao.corTexto }]}>
                  {medicao.classificacao}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Editar medição"
                hitSlop={10}
                onPress={() => navigation.navigate('NovaMedicao', { alunoId, medicaoId: medicao.id })}
                style={styles.icone}
              >
                <Ionicons name="create-outline" size={22} color={CORES.primaria} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Apagar medição"
                hitSlop={10}
                onPress={() => confirmar('Apagar esta medição?', () => apagarMedicao(medicao))}
                style={styles.icone}
              >
                <Ionicons name="trash-outline" size={22} color={CORES.erro} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <View>
          {!evolucao || evolucao.totalMedicoes < 2 ? (
            <Text style={styles.vazio}>
              Registre mais uma medição para ver a evolução deste aluno.
            </Text>
          ) : (
            <View>
              <View style={styles.cardGrande}>
                <Text style={styles.cardTitulo}>Peso ao longo do tempo (kg)</Text>
                <GraficoPeso medicoes={aluno.medicoes} />
              </View>

              <View style={styles.cardGrande}>
                <Text style={styles.cardTitulo}>Resumo</Text>
                <Text style={styles.linha}>
                  Peso inicial: {formatarNumero(evolucao.pesoInicial, 1)} kg ({formatarDataBr(evolucao.dataInicial)})
                </Text>
                <Text style={styles.linha}>
                  Peso atual: {formatarNumero(evolucao.pesoAtual, 1)} kg ({formatarDataBr(evolucao.dataAtual)})
                </Text>
                <Text style={styles.linha}>
                  Variação total: {formatarVariacao(evolucao.deltaKg)} kg (
                  {formatarVariacao(evolucao.deltaPercentual)}%)
                </Text>
                <Text style={styles.linha}>
                  Desde a medição anterior:{' '}
                  {evolucao.deltaKgUltima === null ? '—' : `${formatarVariacao(evolucao.deltaKgUltima)} kg`}
                </Text>
                <Text style={styles.linha}>
                  Período: {diasEntre(evolucao.dataInicial, evolucao.dataAtual)} dias
                </Text>
                <Text style={styles.linha}>
                  Variação do IMC:{' '}
                  {evolucao.deltaImc === null
                    ? 'não calculada (a altura mudou entre as medições)'
                    : formatarVariacao(evolucao.deltaImc)}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.rodape}>
        <Botao
          titulo="Editar aluno"
          variante="secundario"
          icone="person-outline"
          onPress={() => navigation.navigate('CadastroAluno', { alunoId })}
          style={styles.botaoAcao}
        />
        <Botao
          titulo="Excluir aluno"
          variante="secundario"
          icone="trash-outline"
          onPress={() =>
            confirmar(
              `Excluir ${aluno.nome} e todas as medições? Esta ação não pode ser desfeita.`,
              apagarAluno
            )
          }
          style={styles.botaoAcao}
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
  cabecalho: {
    backgroundColor: CORES.primaria,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: CORES.branco,
  },
  info: {
    fontSize: 14,
    color: CORES.primariaClara,
    marginTop: 4,
  },
  abas: {
    flexDirection: 'row',
    backgroundColor: CORES.superficie,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  abaAtiva: {
    backgroundColor: CORES.primaria,
  },
  abaTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: CORES.primaria,
  },
  abaTextoAtivo: {
    color: CORES.branco,
  },
  botaoAcao: {
    marginBottom: 12,
  },
  vazio: {
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 21,
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
  },
  itemData: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  itemDetalhe: {
    fontSize: 14,
    color: CORES.textoSecundario,
    marginTop: 4,
  },
  itemClassificacao: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  icone: {
    marginLeft: 12,
  },
  cardGrande: {
    backgroundColor: CORES.superficie,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 8,
  },
  linha: {
    fontSize: 14,
    color: CORES.texto,
    marginTop: 6,
    lineHeight: 20,
  },
  rodape: {
    marginTop: 16,
  },
});
