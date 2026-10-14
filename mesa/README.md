# Mesa Hurras Fantasy

Acesse `/mesa/`. E-mail e senha são gerenciados pelo Supabase Auth; nenhuma senha é armazenada pelo site. O projeto Supabase usa tabelas `hf_`, sem modificar as tabelas do quiz.

- O criador da sala é Mestre/ADM; convidados são jogadores. Essa função é determinada pelo banco, não por dados editáveis do usuário.
- Convites aleatórios de 12 caracteres (72 bits), hash SHA-256 no banco, validade de 7 dias e renovação pelo mestre. O jogador tem no máximo oito tentativas por minuto.
- Mensagens persistentes, consulta a cada três segundos, paginação, PDF aberto, imagens, arquivos de áudio e microfone (até cinco minutos). Anexos privados até 20 MB, com links temporários de uma hora.
- `/roll 5d10` registra uma rolagem calculada no servidor, sem aceitar resultados enviados pelo cliente.
- 6–9: +1; 2–4: −1; 5: 0; 10: +2; 1: −2. Cada par 1/10 é anulado. A pontuação pode ser negativa.
- Mestre remove/reabilita jogadores e apaga mensagens da mesa; jogador apaga as próprias mensagens.

A estrutura do banco está em `database/hurras-mesa.sql` e já foi aplicada. A biblioteca Supabase JS 2.57.4 está incluída localmente. Para recuperação de senha e retorno da confirmação de e-mail, autorize a URL pública da instalação na lista de redirecionamentos do Supabase Auth. Login de contas já confirmadas não depende do redirecionamento.

Validação local: `node tests/d10.cjs`. Login, microfone e aparência devem ser verificados no navegador da publicação. A página funciona como HTML estático no Netlify. Autenticação necessária apenas para as mesas; consulta às fichas continua livre.
