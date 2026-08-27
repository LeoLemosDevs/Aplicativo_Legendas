# 🏛️ 04. Como Foi Feito & Arquitetura

Este documento detalha como o sistema foi projetado, a divisão de responsabilidades entre os módulos e como o pipeline de dados, filtros e renderização opera internamente.

---

## 📁 Estrutura de Diretórios

```text
Shorts Aplicativo/
├── index.html                   # Estrutura modular da interface, modais, viewport e timeline
├── package.json                 # Manifesto do projeto e scripts npm
├── vite.config.js               # Configuração do Vite
├── README.md                    # Visão geral do repositório
├── CHANGELOG.md                 # Histórico formal de versões
├── docs/                        # Pasta de documentação técnica detalhada
│   ├── README.md
│   ├── 01-o-que-e-o-programa.md
│   ├── 02-tecnologias-utilizadas.md
│   ├── 03-como-executar.md
│   ├── 04-como-foi-feito-arquitetura.md
│   ├── 05-ultimas-mudancas.md
│   └── 06-servicos-pendentes-roadmap.md
└── src/
    ├── style.css                # Sistema de design glassmorphic e regras de responsividade
    ├── main.js                  # Ponto de entrada, orquestrador de eventos, timeline e projeto
    ├── audio-manager.js         # Gerenciamento de áudio nativo, sintetizador e corte (trim)
    ├── canvas-editor.js         # Motor gráfico Canvas 2D, espectros, filtros, chroma key e textos
    ├── lyrics-sync.js           # Mecanismo de sincronização de letras, SRT parser e exportador
    ├── video-exporter.js        # Gravação de vídeo via MediaRecorder e sincronização temporal
    └── demo-data.js             # Partitura sintética e letra para demonstração imediata
```

---

## 🧩 Detalhamento dos Módulos Principais

### 1. `audio-manager.js` (Gerenciador de Áudio & Trim)
- **Áudio Nativo:** Utiliza uma instância de `HTMLAudioElement` desvinculada do loop de processamento do Web Audio, garantindo reprodução contínua e sem perdas de buffer a 60 FPS.
- **Web Audio AnalyserNode:** Instancia nós de análise de frequência em tempo real (`analyser.getByteFrequencyData()`) para alimentar os visualizadores gráficos de espectro.
- **Sistema de Trim (Corte):** Mantém as propriedades `trimStart` e `trimEnd`. Quando a reprodução atinge `trimEnd`, ela pausa e reposiciona a agulha em `trimStart`.
- **Forma de Onda (Waveform):** Analisa os dados de áudio decodificados em 200 picos de amplitude (`extractPeaks`) e renderiza barras com gradiente neon para a parte tocada, destacando a região do corte e desenhando os manipuladores verde (Início) e vermelho (Fim).

### 2. `canvas-editor.js` (Motor Gráfico 2D, Filtros, Chroma Key & Textos)
- **Motor de Filtros e Efeitos Visuais:**
  - Aplica filtros globais combinados via `ctx.filter` (brilho, contraste, saturação, sépia, matiz e desfoque suave).
  - Desenha a **Vinheta Escura** através de um gradiente radial com centro transparente e bordas escuras.
- **Motor de Chroma Key em Tempo Real (`applyChromaKey`):**
  - Desenha cada frame do vídeo ou imagem em um canvas offscreen otimizado (máx 640px de resolução para performance de 60 FPS).
  - Percorre o buffer de pixels (`Uint8ClampedArray`) calculando a distância euclidiana da cor do pixel em relação à cor-chave (`keyColor`).
  - Aplica transparência total se estiver dentro da tolerância e interpolação de suavidade (feathering) nas bordas.
- **Espectros de Áudio Reativos (`drawSpectrum`):**
  - Desenha 7 estilos gráficos com base nos dados FFT do `AudioManager`.
  - Calcula a energia das bandas graves (< 250 Hz) para disparar expansões dinâmicas (*Beat Punch*) e spikes explosivos no estilo *Trap Nation*.
- **Camadas de Texto Personalizado & Animações (`drawTextLayer`):**
  - Calcula a progressão temporal da animação baseada no tempo relativo de entrada (`time - layer.start`) e saída (`layer.end - time`).
  - Interpola matrizes de escala, opacidade e translação para animações suaves (*Fade, Slide Up/Down/Left/Right, Zoom In/Out, Bounce*).
  - Renderiza tipografia rica com quebra de linha, contorno, fundo e sombras.
- **Serialização de Estado do Projeto:**
  - `getProjectState()`: Gera um objeto JSON serializável de todas as configurações, camadas, posições, filtros e estilos.
  - `loadProjectState(state)`: Restaura todos os elementos e instancia imagens/vídeos correspondentes.

### 3. `lyrics-sync.js` (Sincronização & SRT Parser)
- **Modo Gravação:** Escuta eventos de teclado (<kbd>Espaço</kbd>) para marcar o `start` da frase atual e encerrar a anterior.
- **Parser & Exportador SubRip SRT:** Decodifica e codifica blocos de tempo (`00:01:23,450 --> 00:01:28,100`) no padrão internacional SubRip UTF-8.
- **Compensação de Atraso (`timingOffset`):** Permite adiantar ou atrasar todas as frases uniformemente para corrigir o tempo de reação humana.

### 4. `video-exporter.js` (Exportador de Vídeo com Sincronia de Tempo de Parede)
- Cria um canvas invisível na resolução configurada (ex: 1080x1920 ou 4K) e captura o stream a 30 ou 60 FPS via `exportCanvas.captureStream(fps)`.
- Captura o áudio direto do elemento nativo via `audioElement.captureStream()`.
- **Duplo Sincronismo Temporal:** Utiliza o relógio de áudio em conjunto com o relógio de renderização para garantir que nenhum frame seja pulado ou finalizado antes de 100%.
- Grava em fatias contínuas (`timeslice: 250ms`) com fallback automático de codecs (`VP9`, `H.264`, `MP4`, `WebM`).

### 5. `main.js` (Orquestrador, Projetos & Timeline Multitrack)
- Conecta os elementos da interface aos métodos dos módulos.
- Gerencia o sistema de **Salvar e Abrir Projetos (`.kproject`)** e auto-save no `localStorage`.
- Gerencia o arrastar e redimensionar de blocos na Timeline (Áudio, Camadas, Textos e Legendas).
- Gerencia o Drag & Drop global de arquivos do sistema.
- Executa o loop principal de animação (`requestAnimationFrame`) com flags de redesenho inteligente (`needsRedraw`).

