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
- **Tipografia Avançada:** Aplicação de contorno (`strokeText`), preenchimento (`fillText`), medição de largura de texto (`measureText`) e cálculo de quebras de linha responsivas.
- **Transformações & Escalas:** Manipulação de matrizes de transformação para suporte a proporções 9:16 (Shorts) e 16:9 (Horizontal).

### 2. Web Audio API & HTML5 Audio Native Pipeline
- **Áudio Nativo:** Roteamento via `HTMLAudioElement` desvinculado do processamento síncrono para eliminar ruídos, estalos e engasgos em taxas de amostragem altas.
- **Sintetizador Procedural de Demonstração:** Emissão de timbres harmônicos com múltiplos osciladores (`OscillatorNode`) e envelopes de ganho (`GainNode`) para execução sem necessidade de arquivos externos.
- **Decodificação de Forma de Onda:** Análise de canais de áudio via `decodeAudioData` e extração de picos de amplitude (`extractPeaks`) para desenho da forma de onda.

### 3. MediaStream Recording API (`MediaRecorder`)
- **Gravação de Vídeo Local:** Captura em tempo real do stream de vídeo gerado pelo canvas (`canvas.captureStream(fps)`) e do áudio (`audioElement.captureStream()`).
- **Codificação de Vídeo em Vários Codecs:** Suporte aos codecs `video/webm;codecs=vp9`, `video/webm;codecs=h264`, `video/webm;codecs=vp8` e `video/mp4;codecs=h264,aac`.
- **Geração de Blobs e Download:** Montagem do arquivo final em memória e disparo de download automático.

### 4. Drag and Drop & FileReader APIs
- **Importação de Arquivos:** Leitura de arquivos `.mp3`, `.wav`, `.png`, `.jpg`, `.mp4` e `.srt` diretamente do sistema de arquivos via arrastar e soltar global ou inputs de arquivo.
