import { montarResultado } from '../utils/imc';

function paraMedicao(linha) {
  return {
    id: String(linha.id),
    alunoId: String(linha.aluno_id),
    data: linha.data,
    ...montarResultado(linha.peso_kg, linha.altura_m),
  };
}

export async function listarMedicoes(db, alunoId) {
  const linhas = await db.getAllAsync(
    'SELECT * FROM medicoes WHERE aluno_id = ? ORDER BY data ASC, id ASC',
    [Number(alunoId)]
  );
  return linhas.map(paraMedicao);
}

export async function buscarMedicao(db, id) {
  const linha = await db.getFirstAsync('SELECT * FROM medicoes WHERE id = ?', [Number(id)]);
  return linha ? paraMedicao(linha) : null;
}

export async function buscarMedicaoDoDia(db, alunoId, data) {
  const linha = await db.getFirstAsync('SELECT * FROM medicoes WHERE aluno_id = ? AND data = ?', [
    Number(alunoId),
    data,
  ]);
  return linha ? paraMedicao(linha) : null;
}

export async function salvarMedicao(db, alunoId, { data, peso, altura }) {
  const agora = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO medicoes (aluno_id, data, peso_kg, altura_m, criado_em)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (aluno_id, data) DO UPDATE SET peso_kg = excluded.peso_kg, altura_m = excluded.altura_m`,
    [Number(alunoId), data, peso, altura, agora]
  );
}

export async function atualizarMedicao(db, id, { data, peso, altura }) {
  await db.runAsync('UPDATE medicoes SET data = ?, peso_kg = ?, altura_m = ? WHERE id = ?', [
    data,
    peso,
    altura,
    Number(id),
  ]);
}

export async function removerMedicao(db, id) {
  await db.runAsync('DELETE FROM medicoes WHERE id = ?', [Number(id)]);
}
