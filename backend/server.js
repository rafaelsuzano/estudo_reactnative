import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors()); // 👈 permite acesso do browser

// Endpoint intermediário
app.get('/cnpj/:cnpj', async (req, res) => {
  try {
    const cnpj = req.params.cnpj;

    const response = await fetch(
      `https://www.receitaws.com.br/v1/cnpj/${cnpj}`
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar CNPJ' });
  }
});

app.listen(3005, () => {
  console.log('API rodando em http://localhost:3005');
});
