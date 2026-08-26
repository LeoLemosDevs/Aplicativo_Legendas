# 📋 Changelog

Todas as alterações notáveis deste projeto estão documentadas neste arquivo.

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
