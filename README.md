# App IMC — Menu Flutuante (Drawer)

Aplicativo em React Native (Expo) que usa o **Menu Flutuante (Drawer) do React Navigation**
para navegar entre as telas.

## Integrantes do grupo

- Lavinia Basilio
- Pedro Enrico Oliveira
- Pedro Gomes Oliveira
- Pedro Moraes Carvalho

## Telas (todas acessíveis pelo menu flutuante)

| Tela | O que faz |
| --- | --- |
| **Início** | Boas-vindas, botão "Abrir menu" e atalhos para as outras telas |
| **Calcular IMC** | Recebe peso e altura, calcula o IMC e mostra a classificação |
| **Histórico** | Lista os cálculos feitos na sessão (permite apagar um ou todos) |
| **Tabela de IMC** | Tabela de classificação da OMS e a fórmula do IMC |
| **Integrantes** | Nomes dos integrantes do grupo |

O menu abre pelo ícone ☰ no cabeçalho ou pelo botão "Abrir menu" da tela inicial.
No iPhone também dá para abrir arrastando o dedo a partir da borda esquerda da tela.

## Como executar

Pré-requisito: Node.js 20.19.4 ou superior (recomendado: a versão LTS atual) e o app
**Expo Go** no celular.

```bash
npm install
npx expo start
```

Depois é só ler o QR Code com o Expo Go (Android) ou com a câmera (iPhone).
Também dá para abrir no navegador apertando `w` no terminal do Expo.

## Estrutura

```
App.js                              # NavigationContainer + provedores
src/
  navigation/DrawerNavigator.js     # createDrawerNavigator com as 5 telas
  components/CustomDrawerContent.js # cabeçalho e rodapé do menu
  components/Botao.js               # botão reutilizável
  screens/                          # as telas do app
  context/HistoricoContext.js       # histórico compartilhado entre telas
  utils/imc.js                      # cálculo e classificação do IMC
  constants/grupo.js                # nomes dos integrantes
  theme/cores.js                    # cores do app
```

## Bibliotecas principais

- `@react-navigation/native` e `@react-navigation/drawer`
- `react-native-gesture-handler`, `react-native-reanimated`, `react-native-screens`,
  `react-native-safe-area-context` (dependências do Drawer)
- `@expo/vector-icons` (ícones do menu)
