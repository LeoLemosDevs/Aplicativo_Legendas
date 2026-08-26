# 🏛️ 04. Como Foi Feito & Arquitetura

Este documento detalha como o sistema foi projetado, a divisão de responsabilidades entre os módulos e como o pipeline de dados e renderização opera internamente.

---

## 📁 Estrutura de Diretórios

```text
Shorts Aplicativo/
├── index.html                   # Documento principal com a estrutura visual e layouts modais
├── package.json                 # Manifesto do projeto e scripts npm
├── vite.config.js               # Configuração do Vite
├── README.md                    # Visão geral do repositório
├── CHANGELOG.md                 # Histórico formal de versões
├── docs/                        # Pasta de documentação detalhada
│   ├── README.md
│   ├── 01-o-que-e-o-programa.md
│   ├── 02-tecnologias-utilizadas.md
│   ├── 03-como-executar.md
│   ├── 04-como-foi-feito-arquitetura.md
│   ├── 05-ultimas-mudancas.md
│   └── 06-servicos-pendentes-roadmap.md
└── src/
    ├── style.css                # Sistema de design glassmorphic e regras de responsividade
    ├── main.js                  # Ponto de entrada, orquestrador de eventos e timeline interativa
    ├── audio-manager.js         # Gerenciamento de áudio nativo, sintetizador e corte (trim)
    ├── canvas-editor.js         # Motor gráfico Canvas 2D, camadas visuais e renderização de legendas
    ├── lyrics-sync.js           # Mecanismo de sincronização de letras, SRT parser e timing
    ├── video-exporter.js        # Gravação de vídeo via MediaRecorder e exportação de arquivo
    └── demo-data.js             # Partitura sintética e letra para demonstração imediata
```

---

## 🧩 Detalhamento dos Módulos Principais

### 1. `audio-manager.js` (Gerenciador de Áudio & Trim)
- **Áudio Nativo:** Utiliza uma instância de `HTMLAudioElement` desvinculada do loop de processamento do Web Audio, garantindo reprodução contínua e sem perdas de buffer a 60 FPS.
- **Sistema de Trim (Corte):** Mantém as propriedades `trimStart` e `trimEnd`. Quando a reprodução atinge `trimEnd`, ela pausa e reposiciona a agulha em `trimStart`.
- **Forma de Onda (Waveform):** Analisa os dados de áudio decodificados em 200 picos de amplitude (`extractPeaks`) e renderiza barras com gradiente neon para a parte tocada, destacando a região do corte e desenhando os manipuladores verde (Início) e vermelho (Fim).

### 2. `canvas-editor.js` (Motor Gráfico & Renderizador 2D)
- **Camadas Visuais:** Gerencia o plano de fundo (Cor, Imagem ou Vídeo) e as camadas frontais de elementos e GIFs.
- **Renderização Dinâmica de Legendas (`drawLyrics`):**
  - Calcula a frase ativa baseando-se no tempo atual (`currentTime`).
  - Aplica escalas diferenciadas: `activeScale` para a frase sendo cantada (destaque aumentado) e `inactiveScale` para as frases vizinhas.
  - Colore exclusivamente a frase ativa com a cor de destaque (`highlightColor`); frases anteriores e posteriores utilizam a cor base (`color`).
- **Interação no Canvas:** Implementa detecção de toque/clique (hit testing) e manipuladores de redimensionamento e translação com o mouse.

### 3. `lyrics-sync.js` (Sincronização & SRT Parser)
- **Modo Gravação:** Escuta eventos de teclado (<kbd>Espaço</kbd>) para marcar o `start` da frase atual e encerrar a anterior.
- **Parser SubRip SRT:** Decodifica blocos de tempo (`00:01:23,450 --> 00:01:28,100`) com suporte a quebras de linha variadas e codificação UTF-8 com BOM.
- **Compensação de Atraso (`timingOffset`):** Permite adiantar ou atrasar todas as frases uniformemente para corrigir o tempo de reação humana.

### 4. `video-exporter.js` (Exportador de Vídeo)
- Cria um canvas invisível na resolução configurada (ex: 1080x1920) e captura o stream a 30 ou 60 FPS via `exportCanvas.captureStream()`.
- Captura o áudio direto do elemento nativo via `captureStream()`.
- Inicia o gravador `MediaRecorder` exatamente no `trimStart` e finaliza no `trimEnd`, gerando um arquivo de vídeo com duração e sincronia perfeitas.

### 5. `main.js` (Orquestrador & Timeline Multitrack)
- Conecta os elementos da interface aos métodos dos módulos.
- Gerencia o arrastar e redimensionar de blocos na Timeline (Áudio, Camadas e Legendas).
- Gerencia o Drag & Drop global de arquivos do sistema.
- Executa o loop principal de animação (`requestAnimationFrame`) com flags de redesenho inteligente (`needsRedraw`).
