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
  return new;
end $$;

drop trigger if exists exige_codigo_de_acesso on auth.users;
create trigger exige_codigo_de_acesso before insert on auth.users
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
