import { addDoc, collection, doc, getDoc, getDocs, updateDoc, writeBatch } from 'firebase/firestore';

import { db } from './firebase';
import { listarMedicoes } from './medicoes';

const alunosRef = collection(db, 'alunos');

function paraAluno(documento) {
  const dados = documento.data();
  return {
    id: documento.id,
    nome: dados.nome,
    dataNascimento: dados.dataNascimento,
    sexo: dados.sexo ?? null,
    alturaPadrao: dados.alturaPadrao ?? null,
    consentimentoEm: dados.consentimentoEm,
    criadoEm: dados.criadoEm,
  };
}

export async function listarAlunos() {
  const resultado = await getDocs(alunosRef);
  const alunos = resultado.docs.map(paraAluno);
  alunos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
  await Promise.all(
    alunos.map(async (aluno) => {
      aluno.medicoes = await listarMedicoes(aluno.id);
    })
  );
  return alunos;
}

export async function buscarAluno(id) {
  const documento = await getDoc(doc(db, 'alunos', id));
  if (!documento.exists()) return null;
  const aluno = paraAluno(documento);
  aluno.medicoes = await listarMedicoes(id);
  return aluno;
}

export async function salvarAluno({ id, nome, dataNascimento, sexo, alturaPadrao }) {
  if (id) {
    await updateDoc(doc(db, 'alunos', id), { nome, dataNascimento, sexo, alturaPadrao });
    return id;
  }
  const agora = new Date().toISOString();
  const novo = await addDoc(alunosRef, {
    nome,
    dataNascimento,
    sexo,
    alturaPadrao,
    consentimentoEm: agora,
    criadoEm: agora,
  });
  return novo.id;
}

export async function removerAluno(id) {
  // O Firestore não apaga as subcoleções sozinho: as medições são apagadas junto com o aluno.
  const medicoes = await getDocs(collection(db, 'alunos', id, 'medicoes'));
  const lote = writeBatch(db);
  medicoes.forEach((medicao) => lote.delete(medicao.ref));
  lote.delete(doc(db, 'alunos', id));
  await lote.commit();
}
