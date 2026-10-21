import { formatarNumero } from './imc';

export function arredondar1(valor) {
  const r = Math.round(valor * 10) / 10;
  return r === 0 ? 0 : r;
}

export function formatarVariacao(valor) {
  const r = arredondar1(valor);
  if (r === 0) return '0,0';
  const sinal = r > 0 ? '+' : '−';
  return `${sinal}${formatarNumero(Math.abs(r), 1)}`;
}

export function calcularEvolucao(medicoes) {
  if (medicoes.length === 0) return null;

  const primeira = medicoes[0];
  const ultima = medicoes[medicoes.length - 1];
  const anterior = medicoes.length > 1 ? medicoes[medicoes.length - 2] : null;
  const mesmaAltura = Math.abs(primeira.altura - ultima.altura) < 0.001;

  return {
    totalMedicoes: medicoes.length,
    pesoInicial: primeira.peso,
    pesoAtual: ultima.peso,
    deltaKg: ultima.peso - primeira.peso,
    deltaPercentual: ((ultima.peso - primeira.peso) / primeira.peso) * 100,
    deltaKgUltima: anterior ? ultima.peso - anterior.peso : null,
    deltaImc: mesmaAltura ? ultima.imc - primeira.imc : null,
    dataInicial: primeira.data,
    dataAtual: ultima.data,
  };
}
