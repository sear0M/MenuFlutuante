const dois = (n) => String(n).padStart(2, '0');

export function dataParaIso(data) {
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}`;
}

export function hojeIso() {
  return dataParaIso(new Date());
}

export function isoParaData(iso) {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function formatarDataBr(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function textoParaIso(texto) {
  const partes = texto.trim().split('/');
  if (partes.length !== 3 || partes.some((p) => !/^\d+$/.test(p))) return null;
  const [dia, mes, ano] = partes.map(Number);
  if (ano < 1900 || mes < 1 || mes > 12 || dia < 1) return null;
  const data = new Date(ano, mes - 1, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) return null;
  return dataParaIso(data);
}

export function mascararData(texto) {
  const digitos = texto.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

export function idadeEm(nascimentoIso, referencia = new Date()) {
  const nascimento = isoParaData(nascimentoIso);
  let idade = referencia.getFullYear() - nascimento.getFullYear();
  const aindaNaoFez =
    referencia.getMonth() < nascimento.getMonth() ||
    (referencia.getMonth() === nascimento.getMonth() && referencia.getDate() < nascimento.getDate());
  if (aindaNaoFez) idade -= 1;
  return idade;
}

export function diasEntre(inicioIso, fimIso) {
  const ms = isoParaData(fimIso) - isoParaData(inicioIso);
  return Math.round(ms / 86400000);
}
