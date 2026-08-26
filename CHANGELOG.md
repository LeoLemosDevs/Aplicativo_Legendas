# 📋 Changelog

Todas as alterações notáveis deste projeto estão documentadas neste arquivo.

## [2.1.0] - 2026-08-26 (Versão tudo funcionando)
### 💎 Estabilidade Total de Exportação, Renderização & Chroma Key
- **🛡️ Renderizador e Processador Chroma Key Ultra-Resiliente:** Proteção total contra dimensões nulas em elementos multimídia durante a renderização quadro a quadro em alta resolução (1080p e 4K).
- **⏱️ Motor de Exportação com Duplo Sincronismo:** Sincronização precisa de quadros através do relógio de áudio e do relógio de renderização contínuo, prevenindo travamentos ou finalizações prematuras.
- **🎬 Gravação em Fatias Contínuas (Chunks de 250ms):** Pipeline de MediaRecorder com fallback dinâmico de codecs (VP9, H.264, MP4, WebM) e buffer contínuo de pacotes.
- **🎯 Todas as Funções Integradas:** Legendas sincronizadas com destaque da frase ativa, corte de áudio (trim), espectros sonoros reativos (Trap Nation, YouTube Columns, Neon), chroma key em vídeos e imagens, e linha do tempo multitrack totalmente operacional.

---

## [2.0.0] - 2026-08-26 (Versão 2.0 Cromakey)
### 🎬 Efeitos de Chroma Key em Tempo Real & Controle Global de Camadas
- **Camadas com Chroma Key (Fundo Transparente):** Suporte para carregar vídeos (`.mp4`, `.webm`) ou imagens/GIFs com tela verde (ex: animação de "Inscreva-se", "Like", "Compartilhe", raios, fumaça e efeitos visuais).
- **Processador de Remoção de Fundo em Tempo Real:** Motor com tolerância ajustável (5% a 80%), suavidade de borda (feathering) e presets rápidos de 🟢 Verde (`#00FF00`) e 🔵 Azul (`#0000FF`) com seletor livre de cor.
- **Inserção Direta de Camadas:** Botões dedicados na aba Camadas para inserir Imagens/Fotos e Vídeos com Chroma Key com 1 clique.
- **Sincronização Total com a Timeline:** Qualquer elemento adicionado aparece instantaneamente na lista de camadas e na trilha da timeline, permitindo mover, redimensionar o tempo de entrada/saída e posicionar livremente pelo mouse.
- **Transição Automática:** Ao soltar ou adicionar qualquer arquivo, a interface seleciona a camada recém-criada e abre automaticamente suas configurações.

---

## [1.6.0] - 2026-08-26 (Versão 1.6 - Espectro de Áudio Reativo)
### ⚡ Motor de Visualização Sonora & Espectros Reativos
- **Modelos de Espectro Profissionais:**
  - **Onda Espelhada Central (Modelos 2 & 5):** Barras verticais simétricas centralizadas com pontas arredondadas e gradiente de cor.
  - **Equalizador Neon Vertical (Modelos 1 & 3):** Barras com subida suave e gradiente contínuo multicolorido.
  - **Campo de Onda Densa de Estúdio (Modelo 4):** Linhas ultrafinas de alta resolução com brilho dourado (Studio Amber Glow).
  - **Trap Nation Circular:** Anel com barras radiais reagindo com pulso de graves (*bass pump*) e suporte a logo central no círculo.
  - **Onda Radial Neon:** Onda spline circular contínua com brilho difuso.
  - **Linha de Onda Fluida & Anel de Partículas:** Visualizadores senoidais e orbitais adicionais.
- **Presets de Cor & Efeitos:**
  - `Multicolor Rainbow` (Verde ➔ Ciano ➔ Rosa ➔ Roxo ➔ Azul)
  - `Fire & Sun Gradient` (Vermelho ➔ Laranja ➔ Amarelo ➔ Verde)
  - `Dourado Studio Glow` (Amber / Gold Neon)
  - `Electric Blue Ocean` (Ciano ➔ Azul Royal ➔ Índigo)
  - `Cyberpunk Neon`, `Trap Nation Red`, `Vaporwave Sunset` e modo `Customizado`.
- **Controle Total no Canvas e Timeline:**
  - Arrastar para qualquer posição, redimensionar com alças interativas no canvas.
  - Ajuste de sensibilidade da batida, raio interno, espessura, quantidade de barras e brilho neon (glow).
  - Bloco visual dedicado na trilha de camadas da timeline para definir segundo de início e fim.
  - Áudio reativo em tempo real tanto no preview quanto gravado quadro a quadro na exportação de vídeo MP4/WebM.

---

## [1.5.0] - 2026-08-26 (Versão 1.5)
### 🎛️ Novas Funcionalidades e Edição Não-Linear
- **Corte da Música (Audio Trim):** Marcadores arrastáveis na timeline e campos numéricos no painel de Mídia para cortar e usar trechos específicos de músicas longas (ex: 60s para Shorts).
- **Timeline Multitrack Completa:** Trilhas dedicadas para Áudio (com forma de onda e trim handles), Camadas Visuais e Legendas.
- **Edição de Camadas por Mouse:** Cada imagem e elemento visual possui uma barra na timeline com handles para ajustar o segundo de entrada e saída (`start` e `end`).
- **Renderização Imediata no Canvas:** Elementos, imagens e vídeos de fundo aparecem instantaneamente ao carregar, sem necessidade de dar Play.
- **Sincronização de Vídeo Pausado:** Scrubbing na timeline atualiza os quadros do vídeo de fundo em tempo real.
- **Arrastar e Soltar Global (Drag & Drop):** Suporte para soltar arquivos `.mp3`, `.wav`, `.png`, `.jpg`, `.mp4` e `.srt` direto da área de trabalho no aplicativo.
- **Timeline Expansível:** Botão para alternar a altura da timeline entre modo compacto e modo expandido.

---

## [1.0.0] - 2026-08-26 (Versão 1.0 Funcionando)
### 🚀 Recursos Completos em Funcionamento
- **Áudio Nativo Cristalino:** Reprodução direta e estável a 60 FPS sem ruídos, cliques ou engasgos.
- **Destaque Inteligente da Letra:** Somente a frase sendo cantada no momento recebe a cor de destaque, retornando à cor base ao passar.
- **Controle de Zoom da Frase Ativa:** Slider independente para ampliação e destaque proporcional da linha atual.
- **Importação & Exportação .SRT:** Compatibilidade total SubRip com codificação limpa UTF-8.
- **Timeline Interativa (Mouse Drag & Resize):** Ajuste fino de tempos arrastando com o mouse na trilha de legendas.
- **Desmarcar ao Clicar Fora:** Limpeza imediata de seleções ao clicar em qualquer espaço livre.
- **Vídeo 9:16 e 16:9:** Suporte completo para Shorts/TikTok e YouTube Padrão com Chroma Key e múltiplas camadas.
- **Painel de Exportação Avançado:** Configuração de bitrate, codecs (MP4/H.264/VP9) e FPS.

---

## [1.1.0] - 2026-08-26
### ✨ Adicionado
- **Suporte a 16:9:** Alternância entre Proporção Vertical (9:16 - Shorts) e Horizontal (16:9 - YouTube).
- **Controle de Zoom do Viewport:** Níveis Padrão, Médio e Full.
- **Presets de Chroma Key:** Botões de 1-clique para Verde Puro (`#00FF00`) e Azul Puro (`#0000FF`).
- **Painel de Exportação OBS-Style:** Seleção de bitrate de vídeo (2.5M a 12M), bitrate de áudio (128k a 320k), taxa de quadros (30/60 FPS) e codecs (H.264, VP9, MP4).
- **Múltiplas Camadas Visuais:** Inserção e posicionamento livre de imagens e GIFs adicionais.

---

## [1.0.0] - 2026-08-26
### 🚀 Lançamento Inicial
- Interface moderna Glassmorphic com Dark Mode.
- Canvas de renderização 2D de alta definição.
- Sincronizador de letras com atalhos de teclado.
- Motor de exportação de vídeo embutido no navegador.
- Suporte a áudio customizado e música de demonstração.
