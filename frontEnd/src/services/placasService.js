export async function consultarPlaca(placa) {
  // Valida se a placa foi informada
  if (!placa || placa.trim() === '') {
    throw new Error('Informe a placa do veículo');
  }

  // Remove caracteres especiais e converte para maiúsculo
  const placaLimpa = placa.replace(/[^A-Z0-9]/gi, '').toUpperCase();

  console.log(`Placa original: "${placa}"`);
  console.log(`Placa limpa: "${placaLimpa}"`);

  if (placaLimpa.length !== 7) {
    throw new Error('Placa deve conter 7 caracteres');
  }

  // Usando o backend como proxy para evitar problemas de CORS
  const url = `http://localhost:3000/consulta-placa/${placaLimpa}`;
  console.log(`Fazendo requisição para: ${url}`);
  
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Erro na resposta:', errorData);
    throw new Error(errorData.erro || 'Erro ao consultar placa');
  }

  return await response.json();
}
