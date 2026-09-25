import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const HistoricoContext = createContext(null);

let proximoId = 1;

export function HistoricoProvider({ children }) {
  const [historico, setHistorico] = useState([]);

  const adicionarRegistro = useCallback((resultado) => {
    const registro = { ...resultado, id: String(proximoId++), data: new Date() };
    setHistorico((anterior) => [registro, ...anterior]);
  }, []);

  const removerRegistro = useCallback((id) => {
    setHistorico((anterior) => anterior.filter((item) => item.id !== id));
  }, []);

  const limparHistorico = useCallback(() => setHistorico([]), []);

  const valor = useMemo(
    () => ({ historico, adicionarRegistro, removerRegistro, limparHistorico }),
    [historico, adicionarRegistro, removerRegistro, limparHistorico]
  );

  return <HistoricoContext.Provider value={valor}>{children}</HistoricoContext.Provider>;
}

export function useHistorico() {
  const contexto = useContext(HistoricoContext);
  if (!contexto) {
    throw new Error('useHistorico precisa estar dentro de <HistoricoProvider>.');
  }
  return contexto;
}
