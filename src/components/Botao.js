import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CORES } from '../theme/cores';

export default function Botao({ titulo, onPress, icone, variante = 'primario', style }) {
  const secundario = variante === 'secundario';
  const corTexto = secundario ? CORES.primaria : CORES.branco;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.botao,
        secundario ? styles.secundario : styles.primario,
        pressed && styles.pressionado,
        style,
      ]}
    >
      {icone ? <Ionicons name={icone} size={20} color={corTexto} style={styles.icone} /> : null}
      <Text style={[styles.texto, { color: corTexto }]}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    backgroundColor: CORES.primaria,
  },
  secundario: {
    backgroundColor: CORES.superficie,
    borderWidth: 1.5,
    borderColor: CORES.primaria,
  },
  pressionado: {
    opacity: 0.8,
  },
  icone: {
    marginRight: 8,
  },
  texto: {
    fontSize: 16,
    fontWeight: '600',
  },
});
