# 📝 05. Últimas Mudanças (Histórico de Versões)

Registro detalhado das principais evoluções, correções de bugs e novos recursos implementados no **Karaoke Shorts Studio**.

---

## 🚀 Versão 2.0 Cromakey (v2.0.0) — *Chroma Key em Tempo Real & Camadas Globais*
- **🎬 Vídeos e Overlays com Chroma Key:** Suporte nativo para vídeos (`.mp4`, `.webm`) ou imagens/GIFs com fundo verde/azul (ex: botões de "Inscreva-se", "Like", "Compartilhe", fumaça, raios e efeitos visuais).
- **🟢 Processador de Chroma Key em Tempo Real:** Motor de remoção de fundo com tolerância (5% a 80%), suavidade de borda (feathering) e presets rápidos de Verde (`#00FF00`) e Azul (`#0000FF`).
- **🖼️ Inserção Direta e Painel Unificado:** Botões dedicados na aba Camadas para adicionar fotos, vídeos com chroma key e espectros com 1 clique.
- **⚡ Sincronização Imediata com a Timeline:** Qualquer elemento adicionado entra automaticamente na timeline multitrack para ajuste de entrada, saída e duração pelo mouse.

---

## 🚀 Versão 1.6 (v1.6.0) — *Espectro de Áudio Reativo & Modelos Profissionais*
- **📶 Colunas do YouTube (Trap / EDM):** Visualizador de colunas com pontas arredondadas e picos energéticos.
- **💥 Explosão de Pontas & Graves no Trap Nation:** Spikes reativos no ritmo dos kicks e graves, com slider de *Impacto da Batida (Pontas & Graves)* de `1.0x` a `4.5x`.
- **📊 7 Estilos de Espectro:** Onda Espelhada Central, Equalizador Neon, Campo de Onda de Estúdio, Trap Nation Circular, Onda Radial, Linha Fluida e Anel de Partículas.
- **🌈 Presets de Cores:** Multicolor Rainbow, Fire & Sun, Dourado Studio Glow, Electric Blue, Cyberpunk Neon e Trap Red.

---

## 🚀 Versão 1.5 (v1.5.0) — *Edição Não-Linear & Multitrack*
- **✂️ Sistema de Corte de Áudio (Trim):** Implementado suporte a definição de trecho inicial (`trimStart`) e final (`trimEnd`), permitindo cortar músicas de qualquer duração para o formato Shorts (ex: 60s).
- **🎞️ Trilha de Camadas na Timeline:** Cada elemento, imagem ou GIF inserido agora é exibido como um bloco interativo na timeline com suporte a arrastar início, fim e corpo pelo mouse.
- **⚡ Renderização Instantânea:** Elementos e fundos inseridos aparecem imediatamente na tela no frame atual sem precisar dar play.
- **🎬 Sincronização de Vídeo de Fundo Pausado:** Ao mover a agulha na timeline com o vídeo pausado, os quadros do vídeo de fundo são atualizados em tempo real.
- **📥 Drag & Drop Global:** Suporte a arrastar e soltar arquivos do computador (`.mp3`, `.wav`, `.png`, `.jpg`, `.mp4`, `.srt`) direto na interface.
- **🔍 Timeline Expansível:** Botão para alternar a altura da timeline entre modo padrão (220px) e expandido (320px).

---

## 🚀 Versão 1.0 Funcionando (v1.0.0) — *Estabilidade de Áudio & Sincronia Perfeita*
- **🔊 Áudio Nativo sem Engasgos:** Remoção de nós intermediários de Web Audio que causavam cliques e travamentos em arquivos com taxas de amostragem diferentes.
- **🎯 Destaque Exclusivo da Frase Atual:** Apenas a linha que está sendo cantada no momento fica colorida e com zoom ampliado; as linhas que já passaram voltam à cor base.
- **🔍 Controle de Zoom da Frase Ativa:** Adicionados sliders para ajuste independente da escala da linha ativa (`1.0x` a `2.5x`) e linhas vizinhas (`0.4x` a `1.0x`).
- **📄 Exportação e Importação .SRT SubRip Estrita:** Correção na geração de arquivos `.srt` para garantir compatibilidade com Windows, CapCut, Premiere e DaVinci.
- **🖱️ Timeline Interativa de Legendas:** Suporte a mouse drag & resize nas frases da legenda com tooltip em tempo real.
- **✨ Desseleção Global:** Clicar em qualquer área vazia do canvas ou viewport limpa as seleções ativas.

---

## 🎨 Versão 1.1 (v1.1.0) — *Proporções & Chroma Key*
- **Suporte a 16:9 (Horizontal) e 9:16 (Vertical):** Alternância instantânea de aspect ratio.
- **Presets de Chroma Key:** Botões de 1-clique para Verde Puro (`#00FF00`) e Azul Puro (`#0000FF`).
- **Painel de Exportação Avançado:** Escolha de resolução (720p, 1080p, 4K), taxa de quadros (30/60 FPS) e bitrates customizados.
- **Suporte a Múltiplas Camadas Visuais:** Inserção e sobreposição de imagens flutuantes com controle de opacidade e ordenação (Z-Index).
