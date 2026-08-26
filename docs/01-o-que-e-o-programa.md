# 🎙️ 01. O que é o Programa

## 📖 Visão Geral

O **Karaoke Shorts Studio** é uma aplicação web profissional para criação, sincronização e renderização de vídeos curtos de karaokê (Shorts para YouTube, Reels para Instagram e vídeos para o TikTok) e vídeos tradicionais horizontais (16:9).

O sistema opera **100% no navegador (Client-Side)**, dispensando servidores de renderização caros ou softwares pesados de edição de vídeo (como Premiere ou After Effects) para a criação rápida de conteúdo musical sincronizado.

---

## 🎯 Principais Funcionalidades

### 1. 🎵 Sincronização Inteligente de Letras (Karaokê)
- Sincronização em tempo real pressionando a tecla <kbd>Espaço</kbd> no ritmo da música.
- **Destaque Dinâmico:** Apenas a frase sendo cantada no momento recebe a cor de destaque (karaokê) e amplia em tamanho com zoom proporcional configurável; as frases que já passaram voltam à cor base, mantendo o cantor focado na linha certa.
- Suporte a mais de **30 Fontes Modernas do Google Fonts** com ajustes de negrito, itálico, alinhamento, contorno e efeitos de animação (Fade, Pop, Glow e Bounce).

### 2. ✂️ Corte e Edição de Áudio (Audio Trim)
- Permite carregar músicas longas (ex: 5 minutos) e definir exatamente o trecho a ser utilizado (ex: 60 segundos) usando alças interativas na forma de onda ou campos numéricos de início/fim.

### 3. 🎞️ Timeline Multitrack Interativa
- Trilhas dedicadas para **Áudio**, **Camadas Visuais (Imagens/GIFs)** e **Legendas**.
- Suporte total a mouse drag & resize: arraste as pontas para definir o segundo exato de entrada e saída de cada frase ou imagem, ou arraste o corpo do bloco para movê-lo no tempo.
- Tooltip com visualização em tempo real de início, término e duração da exibição.

### 4. 🖼️ Múltiplas Camadas Visuais & Chroma Key
- Fundo personalizável com Cor Sólida, Imagem ou Vídeo em loop.
- Presets rápidos de **Verde Chroma (`#00FF00`)** e **Azul Chroma (`#0000FF`)** para uso em pós-produção com transparência.
- Camadas flutuantes adicionais (Logos, molduras, fotos e GIFs) com ajuste de opacidade, escala, posição e z-index.

### 5. 📄 Importação e Exportação de Legendas .SRT
- Importação direta de arquivos `.srt` pré-existentes.
- Exportação limpa em padrão SubRip UTF-8 compatível com qualquer software de edição externo.

### 6. 🎬 Motor de Exportação em Vídeo de Alta Qualidade
- Renderização local de vídeo acelerada via `MediaRecorder` em formatos **WebM (VP9 / H.264)** e **MP4 nativo**.
- Configurações de taxa de quadros (30 FPS / 60 FPS), bitrate de vídeo (2.5 Mbps a 12 Mbps) e bitrate de áudio (128 kbps a 320 kbps).
- Resoluções predefinidas: **1080p (Full HD)**, **720p (HD)** e **4K (Ultra HD)**.
