# 🔮 06. Serviços Pendentes & Roadmap de Melhorias

Este documento cataloga os recursos planejados, melhorias arquiteturais e novas funcionalidades em potencial para as próximas versões do **Karaoke Shorts Studio**.

---

## 📋 Lista de Serviços Pendentes & Roadmap

### 1. 🌈 Espectro de Áudio Circular (Circular Audio Spectrum / Visualizer)
- **Descrição:** Adicionar um componente gráfico de visualizador de áudio reativo em formato circular (com barras, ondas radiais ou partículas) que pulsa e reage à frequência da música em tempo real.
- **Benefício:** Aumenta o dinamismo visual em vídeos musicais para Shorts e TikTok, especialmente em faixas com batida forte ou solos instrumentais.
- **Planejamento Técnico:** Utilizar `AnalyserNode` da Web Audio API com `getByteFrequencyData` e renderização de coordenadas polares (`cos`/`sin`) no Canvas 2D.

### 2. ⚡ Sincronização Palavra por Palavra (Word-by-Word Karaoke Fill)
- **Descrição:** Além da sincronização linha por linha, permitir marcar cada palavra individual com preenchimento gradual da esquerda para a direita (estilo videokê tradicional ou Reels do Instagram).
- **Planejamento Técnico:** Estender a estrutura do array `words` para armazenar `word.start` e `word.end` e renderizar texto com máscara de preenchimento (`ctx.clip()`).

### 3. 💾 Salvar e Carregar Projetos (.json)
- **Descrição:** Permitir que o usuário salve o estado completo do projeto (áudio referenciado, camadas, posições, tempos de legenda e estilos) em um arquivo `.karaoke` (JSON) e recarregue mais tarde para continuar editando.

### 4. 🔤 Importação de Fontes Customizadas (.ttf / .otf / .woff2)
- **Descrição:** Permitir o upload de arquivos de fonte locais do computador para além das 30 fontes do Google Fonts já incluídas.

### 5. 🎛️ Efeitos de Transição de Camada
- **Descrição:** Efeitos de fade-in e fade-out automáticos nos blocos de imagem/camada na timeline ao entrarem e saírem de cena.

### 6. 📱 Preset Rápido para Mídias Sociais
- **Descrição:** Botões de 1-toque com presets de corte automático (15s, 30s, 60s, 90s) para Instagram Stories, TikTok e YouTube Shorts.

---

## 📌 Prioridades do Backlog

| Prioridade | Recurso | Complexidade Estimada | Status |
| :---: | :--- | :---: | :---: |
| 🟡 Alta | Espectro de Áudio Circular / Visualizer | Média | 🎯 Planejado |
| 🟡 Alta | Salvar / Carregar Projeto (.json) | Baixa | 🎯 Planejado |
| 🟢 Média | Sincronização Palavra por Palavra (Word Fill) | Alta | 🎯 Planejado |
| 🟢 Média | Upload de Fontes Locais (.ttf/.otf) | Baixa | 🎯 Planejado |
| 🔵 Baixa | Transições Fade-in/Fade-out nas Camadas | Baixa | 🎯 Planejado |
