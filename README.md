# 🎵 Karaoke Shorts Studio

**Karaoke Shorts Studio** é uma aplicação completa e moderna para criação, sincronização e renderização de vídeos curtos (Shorts/Reels/TikTok) e vídeos clássicos (16:9) de karaokê com animação de letras em tempo real, suporte a Chroma Key, edição visual na timeline e exportação em alta definição.

---

## 🚀 Principais Recursos

### 🎬 1. Vídeo & Proporções
- **Modos de Visualização:**
  - **Vertical (9:16 - Shorts / Reels / TikTok):** Resoluções 1080x1920 (FHD) e 720x1280 (HD).
  - **Horizontal (16:9 - YouTube Padrão):** Resoluções 1920x1080 (FHD) e 1280x720 (HD).
- **Controle de Zoom do Viewport:** Botões **Padrão**, **Médio** e **Full** com redimensionamento fluido para melhor ergonomia de trabalho.
- **Fundos Personalizáveis:**
  - Cor sólida e presets rápidos de **Chroma Key (Verde #00FF00 e Azul #0000FF)** em tela cheia.
  - Carregamento de imagem de fundo com redimensionamento proporcional.
  - Carregamento de vídeo de fundo sincronizado com o áudio.
- **Camadas Extras (Overlays):**
  - Inserção de imagens e GIFs flutuantes com controle de opacidade, tempo de início/fim e reordenação de profundidade (Z-Index).

### 🎙️ 2. Áudio & Sincronização
- **Reprodução Nativa Ultra-Fluida:** Áudio direto de alta fidelidade sem ruídos, travamentos ou estalos.
- **Waveform Dinâmico:** Visualização da forma de onda do áudio na timeline com scrubbing interativo (clique para posicionar a agulha).
- **Modo de Gravação de Sincronia ao Vivo:**
  - Atalho <kbd>Espaço</kbd>: Marca o início da frase no ritmo da melodia.
  - Atalho <kbd>Enter</kbd>: Define o fim da frase atual para pausas longas.
- **Compensação de Atraso (Timing Offset):** Slider de -1.0s a +1.0s para ajustar a resposta motora em tempo real.

### 📝 3. Legendas & Arquivos .SRT
- **Importação Direta de .SRT:** Carregamento instantâneo de legendas com tempos prontos, codificação automática UTF-8 e sanitização.
- **Exportação para .SRT:** Baixe o arquivo `.srt` sincronizado para reutilizar em outros editores (CapCut, Premiere, DaVinci).
- **Ajuste com o Mouse na Timeline:**
  - **Arrastar ponta esquerda:** Redefine o início da frase.
  - **Arrastar ponta direita:** Redefine o fim da frase.
  - **Arrastar pelo meio:** Move a frase inteira na linha do tempo.
  - **Tooltip em tempo real:** Exibe os tempos de início, término e duração (`00:04.20 ➔ 00:08.50`).

### 🎨 4. Estilização de Texto
- Seleção de fontes tipográficas modernas (Montserrat, Outfit, Inter, Bebas Neue, Playfair, Oswald, etc.).
- Ajuste de tamanho, alinhamento, posição vertical, cor base, cor de destaque e contorno (*stroke*).
- Animações disponíveis: Varredura de Cor suave, Destaque por Frase e Bolinha Saltitante.

### 📦 5. Exportação Avançada (Estilo OBS)
- Painel de configuração de saída com seleção de:
  - **Resolução:** 1080p, 720p, 4K.
  - **Formatos e Codecs:** MP4 Nativo, WebM (H.264), WebM (VP9).
  - **Taxa de Quadros (FPS):** 30 FPS ou 60 FPS.
  - **Bitrate de Vídeo:** 2.5 Mbps até 12 Mbps.
  - **Bitrate de Áudio:** 128 kbps até 320 kbps.
  - **Aceleração por Hardware:** Ativada por padrão com fallback inteligente.

---

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
|---|---|
| <kbd>Espaço</kbd> | Play / Pause (fora de digitação) ou Marcar Frase (durante sinc) |
| <kbd>Enter</kbd> | Fechar frase / Pausa (durante gravação de sinc) |
| <kbd>Setas</kbd> | Mover elemento selecionado no canvas (1px ou 10px com <kbd>Shift</kbd>) |
| <kbd>Delete</kbd> | Excluir camada visual selecionada |

---

## 🛠️ Tecnologias Utilizadas

- **Frontend Core:** HTML5, CSS3 Glassmorphism, JavaScript ES Modules (Vanilla JS).
- **Canvas 2D Engine:** Renderizador customizado a 60 FPS para composição multicamadas e texto.
- **Audio Engine:** HTML5 Media Engine + Web Audio API (análise de waveform e sintetizador procedural).
- **Video Exporter:** Web Codecs & MediaRecorder API com multiplexação MP4/WebM.
- **Bundler & Dev Server:** Vite.

---

## 💻 Como Rodar o Projeto

1. **Instalar Dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:5173`.

3. **Gerar a Versão de Produção:**
   ```bash
   npm run build
   ```

---

## 📄 Licença
Projeto desenvolvido para criação de conteúdo audiovisual e karaokê.
