// Funções de cálculo e classificação do IMC (Índice de Massa Corporal).
// Fórmula: IMC = peso (kg) / altura² (m)

// Faixas de classificação segundo a Organização Mundial da Saúde (OMS).
// "limite" é o valor máximo (exclusivo) de IMC de cada faixa.
// "cor" é usada em marcadores e bordas; "corTexto" é uma versão mais escura
// da mesma cor, para o texto ficar legível sobre fundo branco.
export const FAIXAS_IMC = [
  { limite: 18.5, classificacao: 'Abaixo do peso', faixa: 'Menor que 18,5', cor: '#1E88E5', corTexto: '#1565C0' },
  { limite: 25, classificacao: 'Peso normal', faixa: '18,5 a 24,9', cor: '#2E7D32', corTexto: '#2E7D32' },
  { limite: 30, classificacao: 'Sobrepeso', faixa: '25,0 a 29,9', cor: '#F9A825', corTexto: '#9A6700' },
  { limite: 35, classificacao: 'Obesidade grau I', faixa: '30,0 a 34,9', cor: '#EF6C00', corTexto: '#B45309' },
  { limite: 40, classificacao: 'Obesidade grau II', faixa: '35,0 a 39,9', cor: '#D84315', corTexto: '#BF360C' },
  { limite: Infinity, classificacao: 'Obesidade grau III', faixa: '40,0 ou mais', cor: '#B71C1C', corTexto: '#B71C1C' },
];

// Converte o texto digitado em número, aceitando vírgula ou ponto como decimal.
// Retorna NaN quando o texto não é um número válido.
export function converterNumero(texto) {
  const normalizado = String(texto).trim().replace(',', '.');
  // Aceita "70", "70.5", "70,5", "70," e ",5".
  if (!/^(\d+\.?\d*|\.\d+)$/.test(normalizado)) {
    return NaN;
  }
  return Number(normalizado);
}

// Aceita a altura em metros (1,75) ou em centímetros (175).
export function normalizarAltura(altura) {
  return altura > 3 ? altura / 100 : altura;
}

export function calcularImc(peso, alturaEmMetros) {
  return peso / (alturaEmMetros * alturaEmMetros);
}

// O IMC é arredondado para 1 casa decimal (padrão da OMS) antes de
// classificar e de exibir, para o valor mostrado na tela (ex.: "25,0")
// sempre bater com a faixa da tabela.
export function arredondarImc(imc) {
  // toPrecision(12) remove o "ruído" das contas com casas decimais
  // (ex.: 80 / 1,6² dá 31,249999... em vez de 31,25), para arredondar certo.
  return Math.round(Number((imc * 10).toPrecision(12))) / 10;
}

export function classificarImc(imc) {
  return FAIXAS_IMC.find((item) => imc < item.limite);
}

// Formata um número no padrão brasileiro (vírgula como separador decimal).
export function formatarNumero(valor, casas = 2) {
  return valor.toFixed(casas).replace('.', ',');
}

// Valida os campos e devolve { erro } ou { resultado }.
export function avaliarImc(textoPeso, textoAltura) {
  const peso = converterNumero(textoPeso);
  const alturaDigitada = converterNumero(textoAltura);

  if (Number.isNaN(peso) || Number.isNaN(alturaDigitada)) {
    return { erro: 'Preencha peso e altura com números válidos.' };
  }

  const altura = normalizarAltura(alturaDigitada);

  if (peso < 2 || peso > 500) {
    return { erro: 'Informe um peso entre 2 e 500 kg.' };
  }
  if (altura < 0.4 || altura > 2.6) {
    return { erro: 'Informe uma altura entre 0,40 e 2,60 m (ou 40 a 260 cm).' };
  }

  const imc = arredondarImc(calcularImc(peso, altura));
  const faixa = classificarImc(imc);

  return {
    resultado: {
      peso,
      altura,
      imc,
      classificacao: faixa.classificacao,
      cor: faixa.cor,
      corTexto: faixa.corTexto,
    },
  };
}
