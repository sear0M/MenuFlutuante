# App IMC — Menu Flutuante (Drawer)

Aplicativo em React Native (Expo) para calcular o **IMC (Índice de Massa Corporal)**.
A navegação entre as telas é feita pelo **Menu Flutuante (Drawer) do React Navigation**.

O app calcula o IMC a partir do peso e da altura e mostra a classificação segundo a OMS.
Também cadastra alunos e guarda as medições de cada um num banco de dados na nuvem, o
**Firebase Firestore**, para acompanhar a evolução e comparar alunos.

## Integrantes do grupo

- Lavinia Basilio
- Pedro Enrico Oliveira
- Pedro Gomes Oliveira
- Pedro Moraes Carvalho

## Sumário

- [Telas](#telas)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como executar](#como-executar)
- [Como usar o app](#como-usar-o-app)
- [Problemas comuns](#problemas-comuns)
- [Banco de dados (Firebase)](#banco-de-dados-firebase)
- [Regras do cálculo](#regras-do-cálculo)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Organização do código](#organização-do-código)

## Telas

Todas as telas principais são acessadas pelo menu flutuante, que abre pelo ícone ☰ no cabeçalho.

| Tela | O que faz | Usa o banco? |
| --- | --- | --- |
| **Início** | Boas-vindas, explicação de como abrir o menu e atalhos para as outras telas | Não |
| **Calcular IMC** | Calculadora rápida: recebe peso e altura e mostra o IMC e a classificação | Não |
| **Alunos** | Lista os alunos cadastrados, com busca pelo nome e o último IMC de cada um | Sim (lê) |
| ↳ **Novo aluno / Editar aluno** | Cadastro com nome, data de nascimento, altura padrão e consentimento | Sim (grava) |
| ↳ **Aluno** | Abas **Medições** (lista, editar, apagar) e **Evolução** (gráfico de peso e resumo) | Sim (lê e apaga) |
| ↳ **Nova medição / Editar medição** | Data, peso e altura, com prévia do IMC antes de salvar | Sim (grava) |
| **Comparar alunos** | Marca dois ou mais alunos e compara a evolução de cada um | Sim (lê) |
| **Dados e backup** | Exporta todos os dados num arquivo JSON e explica onde os dados ficam | Sim (lê) |
| **Tabela de IMC** | Faixas de classificação da OMS e a fórmula | Não |
| **Integrantes** | Mostra os integrantes do grupo | Não |

As telas marcadas com ↳ abrem a partir da tela Alunos (navegação em pilha, com botão de voltar).
O menu também mostra, no rodapé, os nomes dos integrantes.

### Usabilidade

- Os campos aceitam vírgula ou ponto como separador decimal (`70,5` ou `70.5`).
- Na calculadora, a altura pode ser digitada em metros (`1,75`) ou em centímetros (`175`).
- Valores inválidos ou fora do intervalo mostram uma mensagem explicando o que corrigir.
- O resultado aparece com a cor da faixa (azul, verde, amarelo, laranja ou vermelho).
- Antes de apagar uma medição ou excluir um aluno, o app pede confirmação.
- Se já existir uma medição no mesmo dia, o app pergunta se deve substituir.
- Enquanto busca os dados no Firebase, o app mostra um indicador de carregamento; sem
  internet, mostra uma mensagem e um botão "Tentar de novo".
- O teclado fecha sozinho ao calcular e ao abrir o menu.
- Os botões têm descrição para leitores de tela (VoiceOver e TalkBack), em português.

## Tecnologias

| Tecnologia | Versão | Para que serve |
| --- | --- | --- |
| Expo | SDK 57 | Ferramentas para criar e rodar o app |
| React Native | 0.86 | Base do aplicativo |
| React | 19.2 | Componentes e estado |
| React Navigation (Drawer) | 7 | Menu flutuante e navegação entre as telas |
| react-native-gesture-handler e react-native-reanimated | — | Gestos e animação do menu |
| react-native-safe-area-context | — | Respeitar o entalhe e as bordas da tela |
| @expo/vector-icons | — | Ícones (Ionicons) |
| Firebase (Firestore) | 13 | Banco de dados na nuvem, onde ficam os alunos e as medições |
| expo-file-system e expo-sharing | — | Gerar e compartilhar o arquivo de backup |

O app não tem servidor próprio: ele conversa direto com o Firebase pela internet.

## Pré-requisitos

1. **Node.js na versão LTS atual.** Servem as versões 20.19.4 ou mais nova da linha 20,
   22.13 ou mais nova da linha 22, ou 24.3 ou mais nova. Baixe em <https://nodejs.org>.
   Para conferir a versão instalada:
   ```bash
   node -v
   ```
2. **Git**, para baixar o projeto. No macOS, ele vem com as ferramentas do Xcode;
   no Windows, baixe em <https://git-scm.com>.
3. Para abrir no celular: o app **Expo Go**, instalado pela App Store (iPhone) ou pela
   Google Play (Android). O projeto usa o **Expo SDK 57**. O Expo Go da loja só abre
   projetos da versão mais recente do SDK; se ele não abrir o projeto, veja
   [Problemas comuns](#problemas-comuns).
4. Opcional:
   - Para abrir no **simulador de iPhone**: um Mac com o Xcode instalado.
   - Para abrir no **emulador de Android**: o Android Studio instalado.

## Instalação

1. Baixe o projeto:
   ```bash
   git clone https://github.com/sear0M/MenuFlutuante.git
   ```
2. Entre na pasta:
   ```bash
   cd MenuFlutuante
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure o Firebase: copie o arquivo `src/firebaseConfig.js` do repositório
   **FireBaseIMCKEY** para a pasta `src/` deste projeto. Também dá para usar
   `src/firebaseConfig.example.js` como modelo e colar as chaves de outro projeto Firebase.
   Esse arquivo não vai para o GitHub (está no `.gitignore`).

> No final, o `npm install` pode mostrar avisos de vulnerabilidades (`npm audit`). Isso é
> normal em projetos Expo e não impede o app de rodar. **Não** rode `npm audit fix --force`:
> ele troca a versão do Expo e do React Native e quebra o projeto.

**Se o projeto foi recebido como arquivo compactado (.zip):** extraia a pasta, abra o
terminal dentro dela, rode `npm install` e faça o passo 4 acima.

**Se foram recebidos apenas `package.json`, `App.js` e a pasta `src`:**

1. Crie um projeto Expo em branco:
   ```bash
   npx create-expo-app@latest NomeDoProjeto --template blank --no-agents-md
   ```
2. Entre na pasta `NomeDoProjeto` e substitua o `package.json`, o `App.js` e a pasta `src`
   pelos arquivos recebidos.
3. Rode `npm install` dentro da pasta.

## Como executar

Na pasta do projeto, inicie o servidor do Expo:

```bash
npx expo start
```

O terminal mostra um QR Code e algumas teclas de atalho. Escolha onde abrir:

### No celular (Expo Go)

1. Conecte o celular **na mesma rede Wi-Fi** do computador.
2. Leia o QR Code:
   - **iPhone:** com o app Câmera.
   - **Android:** pelo próprio Expo Go, na opção "Scan QR code".
3. O app abre dentro do Expo Go.

No iPhone, o Expo Go precisa de permissão de rede local:
**Ajustes → Privacidade e Segurança → Rede Local → Expo Go** ativado.

### No celular, em redes diferentes (modo túnel)

Quando o celular e o computador não estão na mesma rede (por exemplo, celular no 4G),
use o modo túnel:

1. Crie uma conta gratuita em <https://expo.dev/signup>.
2. Entre na conta no computador:
   ```bash
   npx expo login
   ```
3. Entre na **mesma conta** no Expo Go do celular.
4. Inicie o servidor em modo túnel:
   ```bash
   npx expo start --tunnel
   ```
   Na primeira vez, o Expo pergunta se pode instalar o pacote `@expo/ngrok`.
   Responda `Y`.
5. Leia o novo QR Code.

### No navegador

Com o servidor rodando, aperte **`w`** no terminal. O app abre no navegador.

### No simulador de iPhone (somente macOS)

Com o servidor rodando, aperte **`i`** no terminal. O simulador abre e instala o
Expo Go automaticamente na primeira vez.

### No emulador de Android

Com um emulador aberto pelo Android Studio, aperte **`a`** no terminal.

## Como usar o app

1. Na tela **Início**, toque no ícone **☰** (canto superior esquerdo) ou no botão
   **"Abrir menu"**. No iPhone, também dá para arrastar o dedo a partir da borda
   esquerda da tela.
2. Para um cálculo rápido, abra **Calcular IMC**, digite o peso e a altura e toque em
   **Calcular**.
3. Para acompanhar alguém, abra **Alunos** → **Novo aluno**. Preencha nome, data de
   nascimento (o aluno precisa ter 18 anos ou mais) e, se quiser, a altura padrão. Marque o
   consentimento e toque em **Salvar**.
4. Na tela do aluno, toque em **Nova medição**, confira a data, digite o peso e salve.
   A prévia mostra o IMC antes de salvar.
5. Com duas medições ou mais, a aba **Evolução** mostra o gráfico de peso e o resumo
   (variação em kg e em %, período e variação do IMC).
6. Em **Comparar alunos**, marque dois ou mais alunos para ver a evolução lado a lado.
7. Em **Dados e backup**, exporte uma cópia de todos os dados em JSON.
8. Em **Integrantes**, veja quem desenvolveu o app.

## Problemas comuns

| Mensagem ou situação | O que fazer |
| --- | --- |
| "The Internet connection appears to be offline" no Expo Go | O celular não alcança o computador. Coloque os dois na mesma rede Wi-Fi e confira a permissão de **Rede Local** do Expo Go no iPhone. Se não der, use o modo túnel. |
| "You need to be signed in to Expo Go and Expo CLI" | Aparece no modo túnel ou em redes sem IPv4. Faça `npx expo login` no computador e entre na mesma conta no Expo Go. |
| O QR Code aponta para `127.0.0.1` | O computador está numa rede sem IPv4 (comum no roteador do celular no 4G). Use uma rede Wi-Fi comum ou o modo túnel. |
| "Project is incompatible with this version of Expo Go" | O projeto usa o SDK 57. Se o Expo Go for mais antigo, atualize-o pela loja. Se a loja já tiver um Expo Go mais novo (SDK 58 ou superior), ele não abre mais este projeto: no Android, instale o Expo Go do SDK 57 pelo site <https://expo.dev/go>; no iPhone, abra pelo navegador (tecla `w`) ou pelo simulador no Mac (tecla `i`), que instala a versão certa do Expo Go sozinho. |
| "Port 8081 is running this app in another window" ou "Port 8081 is being used by another process" | A porta 8081 já está em uso, normalmente por outro `npx expo start` aberto. Feche o outro terminal ou responda `Y` quando o Expo perguntar se pode usar outra porta. |
| "Não foi possível carregar os alunos. Verifique a internet." | O app precisa de internet para falar com o Firebase. Confira a conexão do celular. Se a internet estiver boa, confira se o arquivo `src/firebaseConfig.js` existe e se as **regras do Firestore** ainda permitem acesso: no console do Firebase, abra **Firestore Database → Regras**. Banco criado em "modo de teste" para de aceitar acessos 30 dias depois da criação. |
| Erro "Unable to resolve ../firebaseConfig" | Falta o arquivo de configuração do Firebase. Faça o passo 4 da [Instalação](#instalação). |
| O app não atualiza ou mostra erros estranhos | Pare o servidor (`Ctrl + C`) e inicie limpando o cache: `npx expo start -c`. |
| Erro ou avisos `EBADENGINE` ao rodar `npm install` | Confira a versão do Node com `node -v`. Ela precisa ser 20.19.4 ou mais nova da linha 20, 22.13 ou mais nova da linha 22, ou 24.3 ou mais nova. Na dúvida, instale a versão LTS atual em <https://nodejs.org>. |

## Banco de dados (Firebase)

Os dados ficam no **Firebase Firestore**, um banco de dados na nuvem do Google. Por isso
os alunos aparecem iguais em qualquer celular (ou navegador) que use o app, e o app precisa
de internet para salvar e carregar.

O Firestore guarda **documentos** dentro de **coleções**. A organização é esta:

```
alunos                      (coleção)
└── {id do aluno}           (documento, id criado pelo Firebase)
    ├── nome, dataNascimento, alturaPadrao, consentimentoEm, criadoEm
    └── medicoes            (subcoleção do aluno)
        └── {AAAA-MM-DD}    (documento: o id é a própria data)
            └── data, peso, altura, criadoEm
```

| Campo | Exemplo | Observação |
| --- | --- | --- |
| `nome` | `"Ana Souza"` | |
| `dataNascimento` | `"2000-05-10"` | Formato AAAA-MM-DD |
| `alturaPadrao` | `1.65` ou `null` | Em metros; opcional |
| `consentimentoEm` | `"2026-11-18T21:15:55.632Z"` | Quando o aluno autorizou o registro |
| `criadoEm` | `"2026-11-18T21:15:55.632Z"` | Quando o cadastro foi feito |
| `peso` | `63.2` | Em kg |
| `altura` | `1.65` | Em metros |

Decisões importantes:

- **O id da medição é a data.** Assim cada aluno tem no máximo uma medição por dia: salvar
  de novo no mesmo dia substitui a anterior (o app pergunta antes).
- **O IMC não é salvo**, só o peso e a altura. O app calcula o IMC e a classificação na hora
  de mostrar, com a mesma regra da calculadora.
- **Excluir um aluno apaga as medições dele juntas.** O Firestore não apaga subcoleções
  sozinho, então o app apaga tudo de uma vez num lote (`writeBatch`).
- As validações (peso, altura, data, idade) são feitas no app antes de salvar.

O código do banco fica em `src/data/`:

| Arquivo | Funções |
| --- | --- |
| `firebase.js` | Conecta ao projeto (`initializeApp` e `getFirestore`) |
| `alunos.js` | `listarAlunos`, `buscarAluno`, `salvarAluno`, `removerAluno` |
| `medicoes.js` | `listarMedicoes`, `buscarMedicao`, `salvarMedicao`, `atualizarMedicao`, `removerMedicao` |
| `backup.js` | `montarBackup` e `exportarBackup` (arquivo JSON) |

## Regras do cálculo

- **Fórmula:** IMC = peso (kg) ÷ (altura (m) × altura (m)).
- **Arredondamento:** o resultado é arredondado para **1 casa decimal**, como na
  tabela da OMS.
- **Valores aceitos:** peso entre **2 e 500 kg**; altura entre **0,40 e 2,60 m**
  (ou 40 a 260 cm). Alturas maiores que 3 são consideradas em centímetros.
- **Alunos:** somente com 18 anos ou mais, porque a tabela da OMS abaixo vale para adultos.
- **Classificação (OMS):**

| IMC | Classificação |
| --- | --- |
| Menor que 18,5 | Abaixo do peso |
| 18,5 a 24,9 | Peso normal |
| 25,0 a 29,9 | Sobrepeso |
| 30,0 a 34,9 | Obesidade grau I |
| 35,0 a 39,9 | Obesidade grau II |
| 40,0 ou mais | Obesidade grau III |

Exemplo: 70 kg ÷ (1,75 × 1,75) = **22,9 → Peso normal**.

## Estrutura do projeto

```
MenuFlutuante/
├── App.js                          # Ponto de partida: provedores e navegação
├── index.js                        # Registra o App no Expo
├── app.json                        # Configurações do Expo (nome, ícone, etc.)
├── package.json                    # Dependências e scripts
├── assets/                         # Ícones e imagens do app
└── src/
    ├── firebaseConfig.js           # Chaves do Firebase (fora do GitHub; vem do FireBaseIMCKEY)
    ├── firebaseConfig.example.js   # Modelo do arquivo acima
    ├── navigation/
    │   ├── DrawerNavigator.js      # Menu flutuante com as 7 telas principais
    │   └── AlunosNavigator.js      # Pilha de telas dos alunos (lista, aluno, cadastro, medição)
    ├── components/
    │   ├── CustomDrawerContent.js  # Conteúdo do menu: cabeçalho, itens e rodapé
    │   ├── Botao.js                # Botão reutilizável (preenchido ou contorno)
    │   └── GraficoPeso.js          # Gráfico de barras do peso
    ├── screens/
    │   ├── InicioScreen.js         # Tela inicial
    │   ├── CalcularImcScreen.js    # Calculadora de IMC
    │   ├── AlunosScreen.js         # Lista de alunos
    │   ├── CadastroAlunoScreen.js  # Novo aluno / editar aluno
    │   ├── AlunoDetalheScreen.js   # Medições e evolução de um aluno
    │   ├── NovaMedicaoScreen.js    # Nova medição / editar medição
    │   ├── CompararAlunosScreen.js # Comparação entre alunos
    │   ├── DadosScreen.js          # Backup e informações sobre os dados
    │   ├── TabelaImcScreen.js      # Tabela de classificação
    │   └── IntegrantesScreen.js    # Integrantes do grupo
    ├── data/
    │   ├── firebase.js             # Conexão com o Firebase
    │   ├── alunos.js               # Operações com alunos no Firestore
    │   ├── medicoes.js             # Operações com medições no Firestore
    │   └── backup.js               # Exportação dos dados em JSON
    ├── utils/
    │   ├── imc.js                  # Cálculo, validação e classificação do IMC
    │   ├── evolucao.js             # Cálculo da evolução (variação de peso e IMC)
    │   ├── datas.js                # Conversão e formatação de datas
    │   └── confirmar.js            # Caixa de confirmação (celular e navegador)
    ├── constants/
    │   └── grupo.js                # Nomes dos integrantes
    └── theme/
        └── cores.js                # Cores do app
```

## Organização do código

### Navegação

- `App.js` envolve o app com o `GestureHandlerRootView` (gestos do menu), o
  `SafeAreaProvider` (bordas da tela) e o `NavigationContainer` (navegação).
- `DrawerNavigator.js` cria o menu com `createDrawerNavigator()` e registra as 7 telas
  com `Drawer.Screen`. Cada tela tem um título e um ícone que fica preenchido quando
  a tela está aberta.
- O menu usa `drawerType: 'front'`, ou seja, desliza **por cima** da tela, como um
  menu flutuante.
- `CustomDrawerContent.js` substitui o conteúdo padrão do menu para incluir o
  cabeçalho azul, a lista de telas (`DrawerItemList`) e o rodapé com os integrantes.
- As telas também navegam entre si com `navigation.navigate('NomeDaTela')`, por
  exemplo nos atalhos da tela Início e nos botões do resultado.

### Telas dos alunos (pilha dentro do menu)

- O item **Alunos** do menu abre o `AlunosNavigator.js`, uma navegação em pilha
  (`createNativeStackNavigator`) com 4 telas: lista, aluno, cadastro e medição.
- Assim dá para entrar num aluno, abrir uma medição e voltar com o botão de voltar, sem
  sair do menu flutuante.

### Banco de dados

- As telas não falam com o Firebase diretamente: elas chamam as funções de `src/data/`
  (por exemplo `listarAlunos()` ou `salvarMedicao(alunoId, medicao)`).
- As telas recarregam os dados sempre que voltam a aparecer (`useFocusEffect`), então a
  lista já mostra o aluno ou a medição que acabou de ser salva.
- Cada chamada ao banco tem tratamento de erro (`try/catch`): se a internet cair, a tela
  mostra uma mensagem em vez de travar.

### Cálculo do IMC

Toda a lógica fica em `src/utils/imc.js`, separada das telas:

- `converterNumero`: transforma o texto digitado em número, aceitando vírgula ou ponto.
- `normalizarAltura`: converte centímetros para metros quando necessário.
- `calcularImc` e `arredondarImc`: aplicam a fórmula e arredondam para 1 casa.
- `classificarImc`: encontra a faixa da OMS na lista `FAIXAS_IMC`.
- `avaliarImc`: junta tudo, valida os valores e devolve o resultado ou uma mensagem
  de erro.

### Aparência

- As cores ficam centralizadas em `src/theme/cores.js`.
- O componente `Botao` é usado em várias telas, com as variantes `primario` e
  `secundario`.
