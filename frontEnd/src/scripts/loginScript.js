export async function login(usuario, senha) {
  if (!usuario || !senha) {
    alert('Preencha usuário e senha');
    return { sucesso: false };
  }

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  } catch (error) {
    alert('Erro ao conectar com o servidor');
    return { sucesso: false };
  }
}
