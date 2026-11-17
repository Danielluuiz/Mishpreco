-- MISH Precificação: banco de dados
-- Rode este arquivo inteiro uma vez em: Supabase > SQL Editor > New query > Run.
-- Pode rodar de novo sem problema (não apaga dados).

-- 1) Uma linha por usuário com todos os dados da planilha dele (empresa, meses, serviços, produtos).
create table if not exists public.app_state (
  user_id    uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  constraint app_state_tamanho check (pg_column_size(data) < 5000000)
);

-- 2) Segurança: cada pessoa só lê e grava os próprios dados.
alter table public.app_state enable row level security;

drop policy if exists "le os proprios dados" on public.app_state;
create policy "le os proprios dados" on public.app_state
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "cria os proprios dados" on public.app_state;
create policy "cria os proprios dados" on public.app_state
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "atualiza os proprios dados" on public.app_state;
create policy "atualiza os proprios dados" on public.app_state
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- 3) Acesso pago: só cria conta quem tem um código de acesso válido.
--    O Israel vende pelo WhatsApp e manda um código por cliente. Cada código vale para UMA conta.
--    Contas que já existem continuam funcionando normalmente.
drop trigger if exists limite_de_contas on auth.users;      -- limite de 50 contas do piloto (não usado mais)
drop function if exists public.limite_de_contas();

create table if not exists public.codigos_acesso (
  codigo     text primary key,
  criado_em  timestamptz not null default now(),
  usado_por  uuid references auth.users(id) on delete set null,
  usado_em   timestamptz,
  obs        text            -- livre: nome do cliente, "feira out/26", etc.
);
-- Ninguém lê essa tabela pelo site (RLS ligado e sem regras). Só pelo painel do Supabase.
alter table public.codigos_acesso enable row level security;

create or replace function public.exige_codigo_de_acesso()
returns trigger language plpgsql security definer set search_path = public as $$
declare c text := upper(trim(coalesce(new.raw_user_meta_data->>'codigo','')));
begin
  update public.codigos_acesso set usado_por = new.id, usado_em = now()
   where codigo = c and usado_por is null and usado_em is null;
  if not found then
    raise exception 'MISH_CODIGO: codigo de acesso invalido ou ja usado';
  end if;
  return null;
end $$;

drop trigger if exists exige_codigo_de_acesso on auth.users;
-- AFTER: a conta já existe quando o código é marcado como usado (antes dava erro de chave estrangeira).
-- Se o código for inválido, o erro desfaz a criação da conta do mesmo jeito.
create trigger exige_codigo_de_acesso after insert on auth.users
  for each row execute function public.exige_codigo_de_acesso();

-- Gera códigos novos no formato MISH-XXXX-XXXX (sem letras confusas como O/0, I/1).
create or replace function public.gerar_codigos(qtd int default 20, observacao text default null)
returns setof text language plpgsql security definer set search_path = public as $$
declare
  alfa constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  b bytea; c text; n int := 0;
begin
  while n < qtd loop
    b := decode(replace(gen_random_uuid()::text,'-',''),'hex');
    c := 'MISH-';
    for i in 0..7 loop
      if i = 4 then c := c || '-'; end if;
      c := c || substr(alfa, (get_byte(b,i) % 32) + 1, 1);
    end loop;
    insert into public.codigos_acesso(codigo, obs) values (c, observacao) on conflict do nothing;
    if found then n := n + 1; return next c; end if;
  end loop;
end $$;
-- Ninguém chama essas funções pelo site; só pelo SQL Editor.
revoke all on function public.gerar_codigos(int, text) from public, anon, authenticated;
revoke all on function public.exige_codigo_de_acesso() from public, anon, authenticated;

-- COMO USAR (no SQL Editor):
--   Gerar 50 códigos para a feira:   select * from gerar_codigos(50, 'feira');
--   Ver códigos ainda livres:         select codigo, obs from codigos_acesso where usado_por is null order by criado_em;
--   Ver quem usou cada código:        select c.codigo, c.obs, u.email, c.usado_em
--                                     from codigos_acesso c join auth.users u on u.id = c.usado_por order by c.usado_em desc;
--   Cancelar um código não vendido:   delete from codigos_acesso where codigo = 'MISH-XXXX-XXXX' and usado_por is null;

-- Consulta útil (rode quando quiser): quem criou conta e quando usou pela última vez.
-- select u.email, u.created_at as conta_criada, s.updated_at as ultimo_salvamento,
--        s.data->'company'->>'name' as empresa
-- from auth.users u left join public.app_state s on s.user_id = u.id
-- order by u.created_at;

-- 4) Visão Boss: um gestor vê (só leitura) as planilhas dos clientes de uma carteira.
--    A carteira de um cliente é a observação (obs) do código de acesso que ele usou.
--    Ex.: gerar_codigos(1, 'ADM BOSS') ou gerar_codigos(1, 'ADM BOSS - Espaço GP') entram na carteira 'ADM BOSS'.
create table if not exists public.boss (
  email    text primary key,      -- e-mail da conta do gestor (em minúsculas)
  carteira text not null          -- igual ao obs dos códigos dos clientes dele
);
alter table public.boss enable row level security;   -- ninguém lê pelo site; só pelas funções abaixo

insert into public.boss(email, carteira) values ('amaury.adm@mish.com', 'ADM BOSS')
  on conflict (email) do update set carteira = excluded.carteira;

-- Carteira de quem está logado (null se não for Boss).
create or replace function public.boss_carteira()
returns text language sql stable security definer set search_path = public as $$
  select b.carteira from public.boss b
    join auth.users u on lower(u.email) = lower(b.email)
   where u.id = auth.uid() and u.email_confirmed_at is not null
   limit 1
$$;

-- Clientes da carteira de quem está logado, com a planilha de cada um. Vazio para quem não é Boss.
create or replace function public.boss_clientes()
returns table(user_id uuid, email text, codigo text, criado_em timestamptz, atualizado_em timestamptz, data jsonb)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text, c.codigo, u.created_at, s.updated_at, s.data
    from public.codigos_acesso c
    join auth.users u on u.id = c.usado_por
    left join public.app_state s on s.user_id = u.id
   where c.obs = public.boss_carteira() or c.obs like public.boss_carteira() || ' - %'
   order by coalesce(s.updated_at, u.created_at) desc
$$;
revoke all on function public.boss_carteira() from public, anon;
revoke all on function public.boss_clientes() from public, anon;
grant execute on function public.boss_carteira() to authenticated;
grant execute on function public.boss_clientes() to authenticated;

-- COMO USAR:
--   Novo gestor:            insert into boss values ('email@dominio.com', 'NOME DA CARTEIRA');
--   Códigos para a carteira: select * from gerar_codigos(2, 'ADM BOSS');
--   Código para o gestor criar a conta dele (fora da carteira): select * from gerar_codigos(1, 'BOSS');
