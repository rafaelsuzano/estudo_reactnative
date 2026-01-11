// Carrega variáveis de ambiente (se dotenv estiver instalado)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv não instalado, continua sem ele
}

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/**
 * ============================
 * LOGIN
 * ============================
 */
app.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ message: "Dados obrigatórios" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1 AND senha = $2",
      [usuario, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuário ou senha inválidos" });
    }

    res.json({
      message: "Login realizado com sucesso",
      usuario: result.rows[0].usuario
    });
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

/**
 * ============================
 * CONSULTA CNPJ (ReceitaWS)
 * ============================
 */
app.get("/cnpj/:cnpj", async (req, res) => {
  try {
    const { cnpj } = req.params;

    const response = await axios.get(
      `https://www.receitaws.com.br/v1/cnpj/${cnpj}`
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erro CNPJ:", error.message);
    res.status(500).json({ error: "Erro ao consultar CNPJ" });
  }
});

/**
 * ============================
 * CONSULTA VEÍCULO (MOCK ESTÁVEL)
 * ============================
 * 🔴 KePlaca bloqueia scraping
 * ✅ Endpoint pronto para trocar por API real
 */
app.get("/consulta-veiculo/:placa", (req, res) => {
  const placa = req.params.placa.toUpperCase();

  // MOCK CONTROLADO
  const veiculosMock = {
    FVV1985: {
      marca: "FORD",
      modelo: "KA",
      ano: "2018",
      cor: "PRATA"
    },
    ABC1234: {
      marca: "CHEVROLET",
      modelo: "ONIX",
      ano: "2020",
      cor: "BRANCO"
    }
  };

  const veiculo = veiculosMock[placa];

  if (!veiculo) {
    return res.status(404).json({ erro: "Veículo não encontrado" });
  }

  res.json({
    placa,
    ...veiculo
  });
});

/**
 * ============================
 * CONSULTA PLACA (placas.app.br)
 * ============================
 */

// Cache do token de autenticação
let tokenCache = {
  token: null,
  expiresAt: null
};

/**
 * Autentica na API de placas e retorna o token
 */
async function autenticarPlacasAPI() {
  // Verifica se o token ainda é válido (com margem de 5 minutos)
  if (tokenCache.token && tokenCache.expiresAt && Date.now() < tokenCache.expiresAt - 300000) {
    return tokenCache.token;
  }

  // Credenciais - configure via variáveis de ambiente
  const email = process.env.PLACAS_EMAIL || 'rafaelsuzano@hotmail.com';
  const password = process.env.PLACAS_PASSWORD || 'suzano30';

  if (!email || !password) {
    throw new Error('Credenciais da API de placas não configuradas. Configure PLACAS_EMAIL e PLACAS_PASSWORD');
  }

  try {
    console.log('Autenticando na API de placas...');
    const response = await axios.post(
      'https://placas.app.br/api/v1/authenticate',
      {
        email: email,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Resposta da autenticação:', JSON.stringify(response.data, null, 2));

    // Armazena o token em cache
    // Tenta diferentes formatos de resposta
    const token = response.data.token || 
                  response.data.access_token || 
                  response.data.accessToken ||
                  response.data.data?.token ||
                  response.data.data?.access_token ||
                  response.data.auth?.token;

    if (!token) {
      console.error('Token não encontrado na resposta. Estrutura completa:', JSON.stringify(response.data, null, 2));
      throw new Error('Token não retornado na autenticação. Verifique as credenciais e a estrutura da resposta.');
    }

    console.log('Token obtido com sucesso');
    tokenCache.token = token;
    // Assumindo que o token expira em 24 horas (ajuste conforme necessário)
    // Se a API retornar expiresIn, use esse valor
    const expiresIn = response.data.expiresIn || response.data.expires_in || 86400; // padrão 24h
    tokenCache.expiresAt = Date.now() + (expiresIn * 1000);

    return tokenCache.token;
  } catch (error) {
    console.error("Erro na autenticação da API de placas:", error.message);
    if (error.response) {
      console.error("Resposta da API:", error.response.data);
    }
    throw new Error('Erro ao autenticar na API de placas');
  }
}

/**
 * Endpoint para consultar placa
 */
app.get("/consulta-placa/:placa", async (req, res) => {
  try {
    const { placa } = req.params;
    
    console.log(`Placa recebida no backend (raw): "${placa}"`);
    console.log(`Tipo: ${typeof placa}, Length: ${placa?.length}`);
    
    if (!placa || placa.trim() === '') {
      return res.status(400).json({ erro: "Placa não informada" });
    }
    
    const placaLimpa = placa.toUpperCase().replace(/[^A-Z0-9]/g, '');

    console.log(`Placa limpa: "${placaLimpa}"`);
    console.log(`Placa limpa length: ${placaLimpa.length}`);

    if (!placaLimpa || placaLimpa.length !== 7) {
      return res.status(400).json({ 
        erro: "Placa deve conter 7 caracteres",
        placaRecebida: placa,
        placaLimpa: placaLimpa
      });
    }

    // Autentica e obtém o token
    const token = await autenticarPlacasAPI();

    // Faz a consulta da placa
    // Endpoint correto: POST /api/v1/placas/numero com placa no payload
    // Tenta diferentes formatos de campo que a API pode esperar
    // Começa com "placa" pois a mensagem de erro menciona "placa"
    const payloads = [
      { placa: placaLimpa },
      { numero: placaLimpa },
      { plate: placaLimpa }
    ];
    
    let response;
    let lastError;
    
    for (const payload of payloads) {
      try {
        console.log(`Tentando payload:`, JSON.stringify(payload, null, 2));
        console.log(`Consultando placa: ${placaLimpa} na API externa`);
        
        response = await axios.post(
          'https://placas.app.br/api/v1/placas/numero',
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Se chegou aqui, funcionou
        console.log(`Sucesso com payload:`, JSON.stringify(payload, null, 2));
        break;
      } catch (error) {
        lastError = error;
        if (error.response) {
          console.log(`Erro com payload ${JSON.stringify(payload)}:`, error.response.status, error.response.data);
          // Se não for erro de campo obrigatório, não tenta outros
          if (error.response.status !== 400 || !error.response.data?.erro?.includes('obrigatória')) {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }
    
    if (!response) {
      throw lastError || new Error('Nenhum formato de payload funcionou');
    }

    // Log da resposta para debug
    console.log("Resposta da API de placas:", JSON.stringify(response.data, null, 2));
    
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao consultar placa:", error.message);
    
    if (error.response) {
      // Erro da API
      const statusCode = error.response.status;
      const errorData = error.response.data;
      console.error("Resposta de erro da API:", JSON.stringify(errorData, null, 2));
      
      const errorMessage = errorData?.message || 
                          errorData?.erro || 
                          errorData?.error ||
                          "Erro ao consultar placa na API";
      
      res.status(statusCode).json({ 
        erro: errorMessage,
        detalhes: errorData
      });
    } else {
      res.status(500).json({ 
        erro: error.message || "Erro ao consultar placa" 
      });
    }
  }
});

/**
 * ============================
 * START SERVER
 * ============================
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
