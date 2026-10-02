# Hurras Fantasy · Guia do projeto

Portal estático de RPG Nexalis, preparado para publicação no Netlify. A página inicial é `index.html` e o diretório de publicação está definido como a raiz (veja `netlify.toml`).

## Navegação
- `hurras-nav.js`: menu responsivo compartilhado, categorias, pesquisa por páginas (Ctrl+K), atalhos e caminho de navegação.
- `hurras-nav.css`: estilo do menu e tratamento de impressão.
- `hurras-home.css`: layout da página inicial.
- `funcoes/`: fichários, bestiário, arquivos de NPCs, regras, habilidades e magia.
- `animais/`, `armas/`, `classes/`, `raca/`, `profissao/`: catálogos de referência. Imagens permanecem sob `assets/`.

## Criação de personagens
- **Ficha clássica:** `funcoes/clan.html`. Código principal em `funcoes/js/clan.js`, visual em `funcoes/css/clan.css` e salvamento em `funcoes/js/ficha-storage.js`. O cofre fica em `funcoes/criacao-de-ficha.html`. Use **Criar ficha aleatória completa** no editor ou **Personagem aleatório** no cofre.
- **Ficha Dark Fantasy:** `funcoes/ficha-dark-fantasy.html`. Editor e sorteios em `funcoes/js/ficha-dark-fantasy.js`, aparência em `funcoes/css/ficha-dark-fantasy.css`. Usa chaves de armazenamento independentes das fichas clássicas. Permite sortear atributos, criar aleatório, imprimir e exportar/importar backup JSON.
- As fichas e notas são salvas **neste navegador**, não nos repositórios do GitHub. Oriente os usuários a exportar cópias regulares.

## Bestiário e NPCs
- `funcoes/bestiario.html` + `funcoes/js/bestiario.js` + `funcoes/css/bestiario.css`: filtro, ordenação, impressão e exportação. Os **95 seres** exibem PV e dano médio indicativos; **não são dados oficiais de balanceamento**. Edite as entradas `DATA` no JavaScript se quiser mudar poderes ou níveis.
- `funcoes/arquivo-npcs.html` + `funcoes/js/arquivo-npcs.js` + `funcoes/css/arquivo-npcs.css`: galeria com 43 NPCs e imagens existentes em `assets/`. Evite publicar notas secretas na página de jogador.
- `animais/animais.html`: catálogo de animais comuns com PV, defesa, dano médio e ataques.

## Manutenção e Netlify
1. O site usa HTML, CSS e JavaScript, sem comando de build; não altere `netlify.toml` sem necessidade.
2. Para adicionar uma nova página, inclua `<script defer src="../hurras-nav.js"></script>` no `<head>` (ou `hurras-nav.js` na raiz) e adicione o link à categoria adequada em `hurras-nav.js`.
3. Mantenha caminhos e maiúsculas/minúsculas corretos: o Netlify distingue arquivos por capitalização.
4. Não misture as chaves de `localStorage` e `IndexedDB` da ficha clássica com as do fichário Dark.
5. A página de **mapas foi removida** da navegação e da publicação. Arquivos históricos de imagem podem ser retidos no repositório como backup para preservar as artes da campanha.
6. Teste a página inicial, botões aleatórios, salvamento, imagens, menu e impressão após cada implantação.
