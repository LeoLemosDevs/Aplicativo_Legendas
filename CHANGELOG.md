# 📋 Changelog

Todas as alterações notáveis deste projeto estão documentadas neste arquivo.

## [1.2.0] - 2026-08-26
### ✨ Adicionado
- **Importação Direta de .SRT:** Card com botão e upload imediato na aba de Letras sem necessidade de sincronização manual.
- **Edição Interativa na Timeline:** Capacidade de arrastar e redimensionar blocos de legendas com o mouse (início, fim e deslocamento total).
- **Tooltip Dinâmico na Timeline:** Visualização em tempo real dos tempos de início, término e duração da frase ao arrastar.
- **Compensação de Atraso (Timing Offset):** Slider para compensar o tempo de reação motora durante a gravação da sincronia.

### ⚡ Otimizações & Correções
- **Áudio Nativo sem Engasgos:** Remoção de `createMediaElementSource` para eliminar ruídos, cliques e travamentos causados por incompatibilidade de taxas de amostragem no Web Audio.
- **Sincronia Precisa de Legendas:** Corrigida a lógica de renderização em tempo real para exibir exatamente a frase cantada no momento sem exigir `end` prévio.
- **Performance de Renderização:** Taxa estável de 60 FPS com buffer desacoplado.

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
