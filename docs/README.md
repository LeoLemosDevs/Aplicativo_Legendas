# 📚 Documentação Oficial — Karaoke Shorts Studio

Bem-vindo à documentação oficial do **Karaoke Shorts Studio**. Aqui você encontrará todas as informações detalhadas sobre a arquitetura, tecnologias, instruções de uso, histórico de evolução e roadmap de melhorias do sistema.

---

## 🗂️ Sumário da Documentação

1. **[01. O que é o Programa](01-o-que-e-o-programa.md)**
   - Visão geral do software
   - Principais recursos e funcionalidades (Sincronização, Espectros, Chroma Key, Textos Animados, Filtros, Projetos)
   - Casos de uso (YouTube Shorts, Instagram Reels, TikTok, Widescreen 16:9)
   
2. **[02. Tecnologias Utilizadas](02-tecnologias-utilizadas.md)**
   - Stack tecnológica central (HTML5, Vanilla CSS, ES Modules, Vite)
   - APIs nativas do navegador (Canvas 2D, Web Audio API, AnalyserNode, MediaRecorder, LocalStorage)
   - Ferramental de desenvolvimento e bibliotecas

3. **[03. Como Executar](03-como-executar.md)**
   - Pré-requisitos de sistema (Node.js e Navegador Moderno)
   - Passo a passo de instalação e execução (`npm run dev`)
   - Como gerar a versão de produção (`npm run build`)

4. **[04. Como Foi Feito & Arquitetura](04-como-foi-feito-arquitetura.md)**
   - Estrutura de pastas e arquivos
   - Funcionamento detalhado dos módulos principais:
     - Gerenciador de Áudio & Análise FFT
     - Motor Gráfico Canvas 2D, Efeitos & Chroma Key
     - Sincronizador de Legendas & SRT Parser
     - Camadas de Texto & Motor de Animações
     - Timeline Multitrack e Exportador de Vídeo
     - Sistema de Serialização de Projetos (.kproject)

5. **[05. Últimas Mudanças](05-ultimas-mudancas.md)**
   - Histórico detalhado de versões (da v1.0 à Versão 3.0)
   - Resolução de diagnósticos, novas ferramentas e estabilidade

6. **[06. Serviços Pendentes & Roadmap](06-servicos-pendentes-roadmap.md)**
   - Tabela de entregas concluídas
   - Recursos futuros para expansão (Whisper IA, fontes locais, stickers, presets de redes sociais)

