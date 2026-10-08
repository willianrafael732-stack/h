# Auditoria e limpeza do repositório Hurras

Data: 08/10/2026 · repositório `willianrafael732-stack/h`, branch `main`.

## Diagnóstico
- Inventário do GitHub: **600 arquivos**, **39 diretórios** e cerca de **25 pares de blobs idênticos** (~66,6 MB de cópias redundantes por tamanho).
- `netlify.toml` usa `publish = "."` sem compilação: **todo arquivo que permanecer no repositório pode ser publicado**, mesmo que não apareça nos menus.
- A pasta `funcoes/maps/` contém 33 imagens (~66,5 MB); 12 possuem cópia idêntica por hash em outra pasta (~37,9 MB). Não excluir automaticamente: falta verificar referências indiretas em páginas antigas, CSS e arquivos de dados.
- Há outras cópias idênticas entre `assets/i/` e `assets/npcs/recuperados/`. São nomes alternativos para imagens de NPCs e podem ser necessários para preservar URLs.

## Limpeza já realizada
1. Foram removidos do Git os dois HTMLs redundantes de login em `entrar/` (o site não usa autenticação). Seus endereços continuam funcionando no **Netlify** via `_redirects` para `/index.html`.
2. O catálogo `funcoes/catalogo.html` deixou de listar dois logins antigos, atalhos de redirecionamento obsoletos e uma entrada duplicada do novo panteão.
3. O redirecionamento `funcoes/inicio.html` foi atualizado para a âncora `#jogar`, existente no portal.
4. O README descreve a estrutura real do novo panteão, do bestiário e o comportamento correto da publicação.

## Manter por compatibilidade
- `funcoes/deuses.html` e `funcoes/deuses/index.html`: redirecionam para Deuses 2; exclusão quebraria URLs antigas.
- `funcoes/legado/`: backups recuperáveis de Deuses 1; candidatos a exclusão **somente após aprovação**.
- `funcoes/deuses2/`, `funcoes/bestiario/`, `funcoes/catalogo/`, `funcoes/js/`, `funcoes/css/`, `classes/`, `raca/`, `armas/`, `assets/`: utilizados por recursos da aplicação.
- `funcoes/dados/`, `funcoes/deuses/dados/`, `funcoes/js/deuses.js`, `funcoes/js/fichas-nordicas.js`, `funcoes/index.html`: arquivos históricos ou de consumo indireto ainda **não comprovados como descartáveis**; requerem análise de referências.

## Próxima etapa de redução do peso
1. Verificar, com busca em **todos** os HTML/CSS/JS/JSON, as referências a `funcoes/maps/` e às imagens iguais por SHA.
2. Identificar qual caminho é canônico, atualizar referências, validar em navegador e só então excluir a cópia redundante.
3. Fazer testes de páginas, imagens, menus, dados do catálogo, exportação e importação; confirmar publicação no domínio Netlify antes de uma limpeza destrutiva maior.

**Não houve remoção automática de imagens, fichas, dados de campanha ou conteúdos do RPG.** As exclusões confirmadas permanecem recuperáveis pelo histórico do Git.
