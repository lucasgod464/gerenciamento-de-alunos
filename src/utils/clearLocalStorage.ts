export const clearLocalStorage = () => {
  // Lista de chaves que queremos manter (se houver alguma)
  const keysToKeep: string[] = [];
  
  // Salvar os valores das chaves que queremos manter
  const savedValues = keysToKeep.reduce((acc, key) => {
    acc[key] = localStorage.getItem(key);
    return acc;
  }, {} as Record<string, string | null>);
  
  // Limpar todo o localStorage
  localStorage.clear();
  
  // Restaurar as chaves que queremos manter
  Object.entries(savedValues).forEach(([key, value]) => {
    if (value) localStorage.setItem(key, value);
  });
  
  console.log('LocalStorage foi limpo com sucesso!');
};