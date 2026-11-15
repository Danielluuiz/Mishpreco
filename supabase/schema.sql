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

-- 3) Limite de contas do piloto. Para mudar, troque o 50 e rode de novo.
create or replace function public.limite_de_contas()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from auth.users) >= 50 then
    raise exception 'MISH_LIMITE: vagas do piloto preenchidas';
  end if;
  return new;
end $$;

drop trigger if exists limite_de_contas on auth.users;
create trigger limite_de_contas before insert on auth.users
  for each row execute function public.limite_de_contas();

-- Consulta útil (rode quando quiser): quem criou conta e quando usou pela última vez.
-- select u.email, u.created_at as conta_criada, s.updated_at as ultimo_salvamento,
--        s.data->'company'->>'name' as empresa
-- from auth.users u left join public.app_state s on s.user_id = u.id
-- order by u.created_at;
