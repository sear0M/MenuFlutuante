import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CORES } from '../theme/cores';
import { SEXOS } from '../utils/gordura';

const ICONES = { feminino: 'female', masculino: 'male' };

export default function SeletorSexo({ valor, onChange, style }) {
  return (
    <View style={[styles.linha, style]} accessibilityRole="radiogroup">
      {SEXOS.map((item) => {
        const marcado = valor === item.valor;
        return (
          <Pressable
            key={item.valor}
            accessibilityRole="radio"
            accessibilityState={{ checked: marcado }}
            accessibilityLabel={`Sexo ${item.rotulo}`}
            onPress={() => onChange(item.valor)}
            style={[styles.opcao, marcado && styles.opcaoMarcada]}
          >
            <Ionicons name={ICONES[item.valor]} size={18} color={marcado ? CORES.branco : CORES.primaria} />
            <Text style={[styles.texto, marcado && styles.textoMarcado]}>{item.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    gap: 10,
  },
  opcao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: CORES.primaria,
    backgroundColor: CORES.superficie,
  },
  opcaoMarcada: {
    backgroundColor: CORES.primaria,
  },
  texto: {
    fontSize: 16,
    fontWeight: '600',
    color: CORES.primaria,
  },
  textoMarcado: {
    color: CORES.branco,
  },
});
