# Reviem de musicas

API de reviews de músicas desenvolvida com Node.js e Express, criadafoco em QA (Qualidade de Software).

O sistema permite pesquisar músicas através da Spotify API e criar reviews com notas e comentários.

---

# Tecnologias

- JavaScript
- Node.js
- Express.js
- Spotify API
- Axios
- Jest
- Supertest
- HTML
- CSS
- JavaScript

---

# Funcionalidades

- Pesquisa de músicas via Spotify
- Criação de reviews
- Listagem de reviews
- Exclusão de reviews
- Validação de dados
- Tratamento de erros
- Testes automatizados

---

# Como executar

## 1. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e adicione suas credenciais da API do Spotify.

Exemplo:

```env
SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_CLIENT_SECRET=seu_client_secret
PORT=3000

Instalar dependências
npm install
3. Rodar em desenvolvimento
npm run dev
4. Rodar testes
npm test
