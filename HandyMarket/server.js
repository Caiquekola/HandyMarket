const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Configurar a pasta para arquivos estáticos
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para o arquivo HTML principal, se necessário
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// Rota para servir a página de login
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

// Configuração do cliente PostgreSQL
const client = new Client({
  user: 'aula',
  host: '200.18.128.54',
  database: 'HandyMarket',
  password: 'aula',
  port: 5432,
});

client.connect()
  .then(() => console.log('Conectado ao PostgreSQL!'))
  .catch(err => console.error('Erro ao conectar', err.stack));

// Rota de registro
app.post('/register', async (req, res) => {
  const { email, data_nasc, nome, sobrenome, senha, genero } = req.body;

  // Verificar se todos os campos necessários foram fornecidos
  if (!email || !data_nasc || !nome || !sobrenome || !senha || !genero) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  try {
    const query = 'INSERT INTO usuario (email, data_nasc, nome, sobrenome, senha, genero) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [email, data_nasc, nome, sobrenome, senha, genero];
    const result = await client.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao inserir dados', err.stack);
    res.status(500).send('Erro ao cadastrar usuário');
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const query = 'SELECT * FROM usuario WHERE email = $1 AND senha = $2';
    const values = [email, senha];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      return res.status(200).json({ redirect: '/html/indexPrestador.html' });
    } else {
      res.status(400).send('Email ou senha incorretos');
    }
  } catch (err) {
    console.error('Erro ao fazer login', err.stack);
    res.status(500).send('Erro ao fazer login');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
