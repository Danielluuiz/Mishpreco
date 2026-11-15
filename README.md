# MISH Precificação

App pago de precificação para salões e barbearias, com conta de usuário e dados salvos na nuvem (Supabase).
A venda é feita pelo WhatsApp do Israel (QR code na feira). Depois do pagamento ele manda um **código de acesso** e o cliente cria a conta com esse código.
Layout, telas, cálculos e textos são os do artefato original. O que foi acrescentado: tela de login e gravação na conta.

## Estrutura

```
mish-precificacao/
├── index.html            Página única
├── css/styles.css        Visual original (sem alteração)
├── css/auth.css          Visual da tela de entrar / criar conta
├── js/config.js          ← COLE AQUI a URL e a chave do Supabase
├── js/auth.js            Login, cadastro, recuperar senha, sincronização com o banco
├── js/app.js             App original (telas, cálculos, Trinks/Avec, Excel)
├── supabase/schema.sql   Tabelas, regras de segurança e códigos de acesso
└── assets/mish-logo-mask.png
```

## Configurar o banco (uma vez, ~10 minutos)

1. Crie uma conta grátis em https://supabase.com e clique em **New project** (região: South America - São Paulo).
2. **SQL Editor > New query**: cole todo o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. **Project Settings > API**: copie a **Project URL** e a **anon public key** para `js/config.js`. No mesmo arquivo, preencha `whatsapp` com o número do Israel.
4. **Authentication > URL Configuration**: em **Site URL** coloque o endereço do site (para testar no computador: `http://localhost:8080`). Depois de publicar, troque pelo endereço real e adicione os dois em **Redirect URLs**.
5. **E-mails**: o envio de e-mail embutido do Supabase só manda poucos e-mails por hora. Escolha uma opção:
   - Mais simples: **Authentication > Sign In / Providers > Email** e desligue **Confirm email**. A pessoa cria a conta e já entra.
   - Mais completo: configure um SMTP próprio (ex.: Resend, gratuito até 3.000 e-mails/mês) em **Authentication > SMTP Settings**. Necessário para o "Esqueci minha senha" funcionar com folga.

## Rodar no computador

Dentro da pasta:

```
python -m http.server 8080
```

e abra http://localhost:8080. (Não abra o `index.html` com dois cliques: o login precisa de um endereço http.)

## Como os dados funcionam

- Cada conta tem uma linha na tabela `app_state` com toda a planilha dela. As regras de segurança (RLS) garantem que cada pessoa só vê os próprios dados.
- Ao alterar qualquer número, o app grava na conta em ~1 segundo. Sem internet, guarda no aparelho e envia quando a conexão voltar.
- Quem já usava a versão sem login no mesmo navegador tem os dados levados para a conta no primeiro acesso.
- Ver quem se cadastrou: Supabase > **Authentication > Users**, ou a consulta no fim do `schema.sql`.

## Vender o acesso (código de acesso)

1. **Gerar códigos** (Supabase > SQL Editor): `select * from gerar_codigos(50, 'feira');` gera 50 códigos no formato `MISH-XXXX-XXXX`. Copie a lista e passe para o Israel.
2. **Na feira**: o cliente lê o QR code, cai no WhatsApp do Israel, paga, e o Israel responde com **um** código da lista e o link do app.
3. **O cliente** abre o app, toca em **Tenho um código de acesso**, digita o código, e-mail e senha. Cada código cria uma única conta; depois de usado não vale de novo.
4. **Controle**: códigos livres e quem usou cada um estão nas consultas no fim do `schema.sql` (ou em Table Editor > `codigos_acesso`).

QR code: aponte para `https://wa.me/55DDDNUMERO?text=Quero%20comprar%20a%20Planilha%20de%20Precifica%C3%A7%C3%A3o%20MISH` (troque pelo número do Israel).

Quem já tinha conta antes da mudança continua entrando normalmente.

## Publicar

Suba a pasta inteira em hospedagem estática (Netlify, Vercel, Hostinger). Depois ajuste a Site URL do passo 4.

Observação: no plano grátis o Supabase pausa o projeto após 7 dias sem nenhum acesso; basta reativar no painel.
