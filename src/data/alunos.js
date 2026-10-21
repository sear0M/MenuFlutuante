import { listarMedicoes } from './medicoes';

function paraAluno(linha) {
  return {
    id: String(linha.id),
    nome: linha.nome,
    dataNascimento: linha.data_nascimento,
    alturaPadrao: linha.altura_padrao,
    consentimentoEm: linha.consentimento_em,
    criadoEm: linha.criado_em,
  };
}

export async function listarAlunos(db) {
  const linhas = await db.getAllAsync('SELECT * FROM alunos ORDER BY nome COLLATE NOCASE ASC');
  const alunos = linhas.map(paraAluno);
  for (const aluno of alunos) {
    aluno.medicoes = await listarMedicoes(db, aluno.id);
  }
  return alunos;
}

export async function buscarAluno(db, id) {
  const linha = await db.getFirstAsync('SELECT * FROM alunos WHERE id = ?', [Number(id)]);
  if (!linha) return null;
  const aluno = paraAluno(linha);
  aluno.medicoes = await listarMedicoes(db, aluno.id);
  return aluno;
}

export async function salvarAluno(db, { id, nome, dataNascimento, alturaPadrao }) {
  if (id) {
    await db.runAsync('UPDATE alunos SET nome = ?, data_nascimento = ?, altura_padrao = ? WHERE id = ?', [
      nome,
      dataNascimento,
      alturaPadrao,
      Number(id),
    ]);
    return String(id);
  }
  const agora = new Date().toISOString();
  const resultado = await db.runAsync(
    `INSERT INTO alunos (nome, data_nascimento, altura_padrao, consentimento_em, criado_em)
     VALUES (?, ?, ?, ?, ?)`,
    [nome, dataNascimento, alturaPadrao, agora, agora]
  );
  return String(resultado.lastInsertRowId);
}

export async function removerAluno(db, id) {
  await db.runAsync('DELETE FROM alunos WHERE id = ?', [Number(id)]);
}
