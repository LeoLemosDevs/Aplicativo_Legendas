# 🚀 03. Como Executar o Projeto

Instruções passo a passo para clonar, instalar dependências, rodar localmente em modo de desenvolvimento e compilar a versão final de produção do **Karaoke Shorts Studio**.

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
1. **Node.js** (Versão 18.0 ou superior recomendada) — [Download Node.js](https://nodejs.org/)
2. **Git** — [Download Git](https://git-scm.com/)
3. **Navegador Moderno** com suporte a Canvas 2D e MediaRecorder (Google Chrome, Brave, Microsoft Edge ou Firefox).

---

## 💻 Passo a Passo de Execução

### 1. Clonar o Repositório
Abra o terminal ou prompt de comando e clone o projeto:
```bash
git clone https://github.com/LeoLemosDevs/Aplicativo_Legendas.git
cd Aplicativo_Legendas
```

### 2. Instalar as Dependências
Execute o comando de instalação para baixar os pacotes necessários:
```bash
npm install
```

### 3. Iniciar o Servidor de Desenvolvimento
Inicie o servidor local com recarregamento em tempo real (Hot Module Replacement):
```bash
npm run dev
```

O terminal exibirá o endereço local, geralmente:
```text
  VITE v8.2.2  ready in 150 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Acesse **`http://localhost:5173`** no seu navegador para utilizar o aplicativo.

---

## 📦 Gerando o Pacote de Produção (Build)

Para compilar e minificar a aplicação para hospedagem em qualquer servidor web (Netlify, Vercel, GitHub Pages, Firebase Hosting ou Apache/Nginx):

```bash
npm run build
```

Os arquivos estáticos otimizados serão gerados na pasta **`dist/`**:
- `dist/index.html`
- `dist/assets/index-*.css`
- `dist/assets/index-*.js`

### Testar a Versão de Produção Localmente
Para visualizar o build final em execução local:
```bash
npm run preview
```
