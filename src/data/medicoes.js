import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, writeBatch } from 'firebase/firestore';

import { db } from './firebase';
import { montarResultado } from '../utils/imc';

// Cada medição fica em alunos/{alunoId}/medicoes/{data}.
// O id do documento é a própria data (AAAA-MM-DD), então cada aluno tem no máximo uma medição por dia.
function medicoesDoAluno(alunoId) {
  return collection(db, 'alunos', alunoId, 'medicoes');
}

function paraMedicao(alunoId, documento) {
  const dados = documento.data();
  return {
    id: documento.id,
    alunoId,
    data: dados.data,
    ...montarResultado(dados.peso, dados.altura),
  };
}

export async function listarMedicoes(alunoId) {
  const resultado = await getDocs(query(medicoesDoAluno(alunoId), orderBy('data', 'asc')));
  return resultado.docs.map((documento) => paraMedicao(alunoId, documento));
}

export async function buscarMedicao(alunoId, data) {
  const documento = await getDoc(doc(medicoesDoAluno(alunoId), data));
  return documento.exists() ? paraMedicao(alunoId, documento) : null;
}

export async function salvarMedicao(alunoId, { data, peso, altura }) {
  const ref = doc(medicoesDoAluno(alunoId), data);
  const atual = await getDoc(ref);
  const criadoEm = atual.exists() ? atual.data().criadoEm : new Date().toISOString();
  await setDoc(ref, { data, peso, altura, criadoEm });
}

export async function atualizarMedicao(alunoId, idAntigo, { data, peso, altura }) {
  const antiga = await getDoc(doc(medicoesDoAluno(alunoId), idAntigo));
  const criadoEm = antiga.exists() ? antiga.data().criadoEm : new Date().toISOString();
  const lote = writeBatch(db);
  // Se a data mudou, o documento troca de id: apaga o antigo e cria o novo.
  if (data !== idAntigo) lote.delete(antiga.ref);
  lote.set(doc(medicoesDoAluno(alunoId), data), { data, peso, altura, criadoEm });
  await lote.commit();
}

export async function removerMedicao(alunoId, id) {
  await deleteDoc(doc(medicoesDoAluno(alunoId), id));
}
