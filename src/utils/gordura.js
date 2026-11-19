import { arredondar1 } from './evolucao';

export const SEXOS = [
  { valor: 'feminino', rotulo: 'Feminino' },
  { valor: 'masculino', rotulo: 'Masculino' },
];

export function rotuloSexo(sexo) {
  return SEXOS.find((item) => item.valor === sexo)?.rotulo ?? 'Sexo não informado';
}

// Faixas de gordura corporal de adultos por sexo e idade (Gallagher et al., 2000).
// limites = [início da faixa saudável, início de "acima do recomendado", início de "obesidade"]
const FAIXAS = {
  feminino: [
    { ateIdade: 39, limites: [21, 33, 39] },
    { ateIdade: 59, limites: [23, 34, 40] },
    { ateIdade: Infinity, limites: [24, 36, 42] },
  ],
  masculino: [
    { ateIdade: 39, limites: [8, 20, 25] },
    { ateIdade: 59, limites: [11, 22, 28] },
    { ateIdade: Infinity, limites: [13, 25, 30] },
  ],
};

const CLASSES = [
  { classificacao: 'Abaixo do recomendado', cor: '#1E88E5', corTexto: '#1565C0' },
  { classificacao: 'Saudável', cor: '#2E7D32', corTexto: '#2E7D32' },
  { classificacao: 'Acima do recomendado', cor: '#F9A825', corTexto: '#9A6700' },
  { classificacao: 'Obesidade', cor: '#B71C1C', corTexto: '#B71C1C' },
];

// O IMC é igual para homens e mulheres. O que muda com o sexo é a gordura corporal:
// com o mesmo IMC, a mulher tem em média mais gordura que o homem.
// Fórmula de Deurenberg (1991), para adultos:
//   % de gordura = 1,2 × IMC + 0,23 × idade − 10,8 × sexo − 5,4   (sexo = 1 homem, 0 mulher)
export function estimarGordura(imc, idade, sexo) {
  if (!FAIXAS[sexo] || !(idade >= 18)) return null;

  const valorSexo = sexo === 'masculino' ? 1 : 0;
  const percentual = Math.max(0, arredondar1(1.2 * imc + 0.23 * idade - 10.8 * valorSexo - 5.4));
  const [inicioSaudavel, inicioAcima, inicioObesidade] = FAIXAS[sexo].find(
    (faixa) => idade <= faixa.ateIdade
  ).limites;

  let indice = 0;
  if (percentual >= inicioObesidade) indice = 3;
  else if (percentual >= inicioAcima) indice = 2;
  else if (percentual >= inicioSaudavel) indice = 1;

  return {
    percentual,
    faixaSaudavel: `${inicioSaudavel}% a ${inicioAcima - 1}%`,
    ...CLASSES[indice],
  };
}
