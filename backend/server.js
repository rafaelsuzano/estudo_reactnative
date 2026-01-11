const express = require("express");
const cors = require("cors");
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
    console.error("Erro no login:", error);
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

    const response = await fetch(
      `https://www.receitaws.com.br/v1/cnpj/${cnpj}`
    );

    if (!response.ok) {
      return res.status(502).json({ error: "Erro ao acessar ReceitaWS" });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Erro ao consultar CNPJ:", error);
    res.status(500).json({ error: "Erro ao consultar CNPJ" });
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
