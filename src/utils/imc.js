// Funções de cálculo e classificação do IMC (Índice de Massa Corporal).
// Fórmula: IMC = peso (kg) / altura² (m)

// Faixas de classificação segundo a Organização Mundial da Saúde (OMS).
// "limite" é o valor máximo (exclusivo) de IMC de cada faixa.
export const FAIXAS_IMC = [
  { limite: 18.5, classificacao: 'Abaixo do peso', faixa: 'Menor que 18,5', cor: '#1E88E5' },
  { limite: 25, classificacao: 'Peso normal', faixa: '18,5 a 24,9', cor: '#2E7D32' },
  { limite: 30, classificacao: 'Sobrepeso', faixa: '25,0 a 29,9', cor: '#F9A825' },
  { limite: 35, classificacao: 'Obesidade grau I', faixa: '30,0 a 34,9', cor: '#EF6C00' },
  { limite: 40, classificacao: 'Obesidade grau II', faixa: '35,0 a 39,9', cor: '#D84315' },
  { limite: Infinity, classificacao: 'Obesidade grau III', faixa: '40,0 ou mais', cor: '#B71C1C' },
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

export function classificarImc(imc) {
  // O IMC é exibido com 1 casa decimal (padrão da OMS). Arredondamos antes
  // de comparar para que o valor mostrado na tela (ex.: "25,0") seja sempre
  // coerente com a faixa da tabela.
  const imcArredondado = Math.round(imc * 10) / 10;
  return FAIXAS_IMC.find((item) => imcArredondado < item.limite);
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

  const imc = calcularImc(peso, altura);
  const faixa = classificarImc(imc);

  return {
    resultado: {
      peso,
      altura,
      imc,
      classificacao: faixa.classificacao,
      cor: faixa.cor,
    },
  };
}
