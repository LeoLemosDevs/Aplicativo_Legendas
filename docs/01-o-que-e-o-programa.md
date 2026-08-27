# 🎙️ 01. O que é o Programa

## 📖 Visão Geral

O **Karaoke Shorts Studio** é uma suíte profissional completa para criação, sincronização, efeitos visuais e renderização de vídeos curtos de karaokê (Shorts para YouTube, Reels para Instagram e TikTok) e vídeos tradicionais widescreen (16:9).

O sistema opera **100% no navegador (Client-Side)** com tecnologia de ponta em HTML5 Canvas 2D, Web Audio API e MediaStream Recording API, dispensando servidores de renderização caros ou softwares pesados de edição de vídeo (como Premiere ou After Effects).

---

## 🎯 Principais Funcionalidades

### 1. 💾 Sistema Completo de Projetos (.kproject / JSON)
- **Salvar Projeto:** Exportação em 1 clique de um arquivo `.kproject` contendo todas as legendas sincronizadas, marcas de tempo SRT, camadas de imagens, vídeos com chroma key, espectros de áudio, textos animados, filtros cinematográficos e cortes de áudio.
- **Abrir Projeto:** Carregamento instantâneo de projetos salvos com restauração de 100% dos elementos e posições.
- **Auto-Save no LocalStorage:** Proteção contra perda de dados acidental ao recarregar a página.

### 2. 🎵 Sincronização Inteligente de Letras (Karaokê)
- Sincronização em tempo real pressionando a tecla <kbd>Espaço</kbd> no ritmo da música.
- **Destaque Dinâmico:** Apenas a frase sendo cantada no momento recebe a cor de destaque (karaokê) e amplia em tamanho com zoom proporcional configurável (`1.0x` a `2.5x`); as frases passadas e futuras voltam à cor base.
- Suporte a mais de **30 Fontes do Google Fonts** com ajustes de negrito, itálico, alinhamento, contorno e animações (Varredura Spotify, Palavra por Palavra, Bolinha Saltitante e Rolagem).

### 3. ✨ Filtros & Efeitos de Vídeo em Tempo Real
- **Aba Efeitos Dedicada:**
  - **8 Presets Cinematográficos:** *Normal, Vintage Retrô, Cyberpunk Neon, Cinema Noir (P&B), Golden Hour (Quente), Sci-Fi Cool, VHS 90s, Ultra Contraste*.
  - **Vinheta Escura (Vignette):** Gradiente radial escuro com controle de intensidade de 0% a 100%.
  - **Controles Manuais:** Brilho (50%-180%), Contraste (50%-200%), Saturação (0%-200%), Sépia (0%-100%), Matiz (Hue Rotate 0°-360°) e Desfoque Suave (Blur 0-15px).

### 4. 🔤 Camadas de Texto Personalizado com Animações
- Inserção de textos personalizados livres no canvas.
- Tipografia rica com Google Fonts, cores, fundo de caixa, contorno, sombra/glow, negrito, itálico e caixa alta.
- **7 Animações de Entrada (In Animation):** *Fade In, Slide Up, Slide Down, Slide Left, Slide Right, Zoom In, Bounce* com tempo ajustável (0.1s a 2.0s).
- **Animações de Saída (Out Animation):** *Fade Out, Slide Down, Slide Up, Slide Left, Slide Right, Zoom Out* com tempo ajustável.

### 5. 📐 Controles Numéricos de Posição (X, Y) e Alinhamento
- Caixa de configuração com inputs numéricos em pixels para `Posição X`, `Posição Y`, `Largura` e `Altura`.
- **Botões Rápidos de Alinhamento:** *Centro H, Centro V, Topo, Base, Esquerda e Direita*.
- Totalmente sincronizado com manipulação livre pelo mouse no canvas.

### 6. 📶 Espectros de Áudio Reativos com Impacto de Batida
- **7 Modelos Visuais:** *Colunas do YouTube (Trap/EDM), Onda Espelhada Central, Equalizador Neon Vertical, Campo de Onda de Estúdio, Trap Nation Circular (com pontas nas batidas), Onda Radial Neon e Linha Fluida*.
- **Controle de Impacto da Batida:** Slider de *Impacto da Batida (Pontas & Graves)* de `1.0x` a `4.5x` para explosão de graves no ritmo dos kicks.
- Logo/Foto customizável no centro do círculo.

### 7. 🟢 Remoção de Fundo com Chroma Key em Vídeos e Imagens
- Remoção em tempo real de fundos verde (`#00FF00`), azul (`#0000FF`) ou qualquer cor personalizada em vídeos (`.mp4`, `.webm`) e imagens/GIFs.
- Controles de tolerância de similaridade e suavidade de borda (feathering).

### 8. ✂️ Corte de Áudio (Trim) & Timeline Multitrack
- Definição do trecho exato de áudio para Shorts (ex: 60 segundos).
- Trilha multitrack com arrastar e redimensionar início e fim de cada bloco pelo mouse.

### 9. 🎬 Motor de Exportação em Vídeo
- Renderização frame a frame sincronizada por relógio duplo (*áudio + render*).
- Formatos: **MP4**, **WebM (VP9 / H.264)** com taxa de quadros (30/60 FPS) e bitrates até 12 Mbps em 1080p e 4K.

