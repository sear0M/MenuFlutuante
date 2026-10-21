import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';

import Botao from '../components/Botao';
import { exportarBackup } from '../data/backup';
import { CORES } from '../theme/cores';

export default function DadosScreen() {
  const db = useSQLiteContext();
  const [exportando, setExportando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function exportar() {
    setExportando(true);
    setMensagem('');
    try {
      await exportarBackup(db);
      setMensagem('Backup gerado com sucesso.');
    } catch (e) {
      setMensagem('Não foi possível gerar o backup. Tente novamente.');
    } finally {
      setExportando(false);
    }
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View style={styles.aviso}>
        <Ionicons name="warning-outline" size={22} color="#9A6700" />
        <Text style={styles.avisoTexto}>
          O arquivo de backup contém dados de saúde (nome, data de nascimento, peso e altura).
          Guarde-o com cuidado e não compartilhe com pessoas não autorizadas.
        </Text>
      </View>

      <Botao
        titulo={exportando ? 'Gerando backup...' : 'Exportar backup (JSON)'}
        icone="download-outline"
        onPress={exportar}
        style={styles.botao}
      />
      {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}

      <Text style={styles.titulo}>Sobre os dados</Text>
      <Text style={styles.texto}>
        Os dados ficam somente no aparelho. Não há sincronização nem cópia em servidor. Se o app
        for desinstalado ou o aparelho trocado sem backup, os dados são perdidos.
      </Text>
      <Text style={styles.texto}>
        Cadastre alunos somente com autorização. O app não substitui avaliação médica ou
        profissional.
      </Text>
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
  aviso: {
    flexDirection: 'row',
    backgroundColor: '#FFF4D6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  avisoTexto: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#9A6700',
    lineHeight: 20,
  },
  botao: {
    marginBottom: 8,
  },
  mensagem: {
    fontSize: 14,
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: 24,
    marginBottom: 8,
  },
  texto: {
    fontSize: 15,
    color: CORES.texto,
    lineHeight: 22,
    marginBottom: 10,
  },
});
