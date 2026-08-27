# 🛠️ 02. Tecnologias Utilizadas

O **Karaoke Shorts Studio** foi desenvolvido com tecnologias web modernas focadas em alta performance, fidelidade gráfica e zero dependência de backend para o processamento de mídias.

---

## 💻 Stack Tecnológica Principal

| Tecnologia | Versão / Padrão | Finalidade no Projeto |
| :--- | :--- | :--- |
| **HTML5** | Semantic HTML5 | Estruturação modular da interface, modais, viewport de vídeo e timeline. |
| **Vanilla CSS** | CSS3 Modern (CSS Variables, Flexbox, Grid, Glassmorphism) | Sistema de design escuro premium, responsividade, transições e efeitos visuais. |
| **JavaScript** | ES2022 (ES Modules) | Toda a lógica de negócio, sincronização, manipulação de áudio, renderização e exportação. |
| **Vite** | `^8.2.2` | Ferramenta de desenvolvimento ultrarrápida (HMR) e empacotador de produção otimizado. |
| **Lucide Icons** | CDN / Standalone | Conjunto de ícones vetoriais modernos integrados na interface. |
| **Google Fonts** | Web Fonts API | Catálogo de mais de 30 famílias tipográficas carregadas dinamicamente. |

---

## ⚡ APIs Nativas do Navegador (Web APIs)

### 1. HTML5 Canvas 2D API (`CanvasRenderingContext2D`)
- **Renderização Gráfica em Tempo Real:** Renderização do canvas de preview e do canvas de exportação a 60 FPS com aceleração por hardware (GPU).
- **Filtros e Efeitos de Vídeo:** Manipulação de `ctx.filter` (brilho, contraste, saturação, sépia, rotação de matiz e desfoque suave) e gradientes radiais para efeito de vinheta escura.
- **Tipografia e Animações:** Motor de interpolação matemática de posição, opacidade e escala para animações de entrada e saída de textos (*Fade, Slide, Zoom, Bounce*).
- **Offscreen Canvas & Chroma Key:** Processamento de pixels em canvas desacoplado para remoção ultra-rápida de fundo verde/azul em tempo real.

### 2. Web Audio API (`AudioContext`, `AnalyserNode`, `GainNode`)
- **Análise de Frequências (FFT):** Extração de dados sonoros em tempo real com `analyser.getByteFrequencyData()` para alimentar os 7 modelos de espectro de áudio.
- **Detecção de Graves & Batidas:** Análise de bandas de frequência graves (< 250 Hz) para disparar spikes e expansões visuais (*Beat Punch*).
- **Sintetizador Procedural de Demonstração:** Emissão de timbres harmônicos com múltiplos osciladores (`OscillatorNode`) e envelopes de ganho (`GainNode`) para execução sem necessidade de arquivos externos.

### 3. MediaStream Recording API (`MediaRecorder`)
- **Gravação em Fatias Contínuas (Chunks de 250ms):** Captura contínua de streams combinados de vídeo (`canvas.captureStream(fps)`) e áudio (`audioElement.captureStream()`).
- **Codificação com Fallback Automático:** Suporte em cascata aos codecs `video/webm;codecs=vp9,opus`, `video/webm;codecs=h264`, `video/webm;codecs=vp8` e `video/mp4`.

### 4. LocalStorage & JSON Project Serialization API
- **Arquivos `.kproject`:** Serialização completa do projeto em JSON contendo legendas, posições, filtros, animações e tempos.
- **Auto-Save Local:** Persistência automática no armazenamento local do navegador para proteção contra fechamentos acidentais.

