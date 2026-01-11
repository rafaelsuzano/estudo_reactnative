export async function consultarCnpj(cnpj) {
  const cnpjLimpo = cnpj.replace(/\D/g, '');

  const response = await fetch(
    `http://localhost:3000/cnpj/${cnpjLimpo}`
  );

  if (!response.ok) {
    throw new Error('Erro ao consultar CNPJ');
  }

  return await response.json();
}
