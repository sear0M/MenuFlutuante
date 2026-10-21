import { Alert, Platform } from 'react-native';

export function confirmar(mensagem, aoConfirmar, rotuloConfirmar = 'Apagar') {
  if (Platform.OS === 'web') {
    if (window.confirm(mensagem)) aoConfirmar();
    return;
  }
  Alert.alert('Confirmação', mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: rotuloConfirmar, style: 'destructive', onPress: aoConfirmar },
  ]);
}
