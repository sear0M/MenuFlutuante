import { Platform } from 'react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { db } from './firebase';

export async function montarBackup() {
  const alunos = await getDocs(collection(db, 'alunos'));
  const dados = [];

  for (const aluno of alunos.docs) {
    const medicoes = await getDocs(
      query(collection(db, 'alunos', aluno.id, 'medicoes'), orderBy('data', 'asc'))
    );
    const { nome, dataNascimento, alturaPadrao, consentimentoEm, criadoEm } = aluno.data();
    dados.push({
      nome,
      dataNascimento,
      alturaPadrao: alturaPadrao ?? null,
      consentimentoEm,
      criadoEm,
      medicoes: medicoes.docs.map((m) => {
        const { data, peso, altura, criadoEm: medidaEm } = m.data();
        return { data, peso, altura, criadoEm: medidaEm };
      }),
    });
  }

  return {
    versao: 1,
    exportadoEm: new Date().toISOString(),
    alunos: dados,
  };
}

export async function exportarBackup() {
  const backup = await montarBackup();
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
