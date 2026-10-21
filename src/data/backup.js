import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function montarBackup(db) {
  const alunos = await db.getAllAsync('SELECT * FROM alunos ORDER BY id ASC');
  const dados = [];

  for (const aluno of alunos) {
    const medicoes = await db.getAllAsync(
      'SELECT data, peso_kg, altura_m, criado_em FROM medicoes WHERE aluno_id = ? ORDER BY data ASC',
      [aluno.id]
    );
    dados.push({
      nome: aluno.nome,
      dataNascimento: aluno.data_nascimento,
      alturaPadrao: aluno.altura_padrao,
      consentimentoEm: aluno.consentimento_em,
      criadoEm: aluno.criado_em,
      medicoes: medicoes.map((m) => ({
        data: m.data,
        peso: m.peso_kg,
        altura: m.altura_m,
        criadoEm: m.criado_em,
      })),
    });
  }

  return {
    versao: 1,
    exportadoEm: new Date().toISOString(),
    alunos: dados,
  };
}

export async function exportarBackup(db) {
  const backup = await montarBackup(db);
  const texto = JSON.stringify(backup, null, 2);
  const dia = new Date().toISOString().slice(0, 10);
  const nomeArquivo = `backup-imc-${dia}.json`;

  if (Platform.OS === 'web') {
    const blob = new Blob([texto], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  const arquivo = new File(Paths.cache, nomeArquivo);
  if (arquivo.exists) arquivo.delete();
  arquivo.create();
  arquivo.write(texto);
  await Sharing.shareAsync(arquivo.uri, { mimeType: 'application/json', dialogTitle: 'Salvar backup' });
}
