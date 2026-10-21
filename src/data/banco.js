export const NOME_BANCO = 'imc.db';

export async function prepararBanco(db) {
  await db.execAsync('PRAGMA foreign_keys = ON;');
  const { user_version: versao } = await db.getFirstAsync('PRAGMA user_version');

  if (versao < 1) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS alunos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          data_nascimento TEXT NOT NULL,
          altura_padrao REAL,
          consentimento_em TEXT NOT NULL,
          criado_em TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS medicoes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
          data TEXT NOT NULL,
          peso_kg REAL NOT NULL CHECK (peso_kg BETWEEN 2 AND 500),
          altura_m REAL NOT NULL CHECK (altura_m BETWEEN 0.4 AND 2.6),
          criado_em TEXT NOT NULL,
          UNIQUE (aluno_id, data)
        );
        PRAGMA user_version = 1;
      `);
    });
  }
}
