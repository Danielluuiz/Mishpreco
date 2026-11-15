/* Configuração do Supabase (login + banco de dados).
   Pegue os dois valores em: Supabase > seu projeto > Project Settings > API.
   A "anon public key" pode ficar no site: quem protege os dados são as regras (RLS) do arquivo supabase/schema.sql. */
window.MISH_CONFIG = {
  supabaseUrl: "COLE_AQUI_A_PROJECT_URL",      // ex.: https://abcdefghijk.supabase.co
  supabaseAnonKey: "COLE_AQUI_A_ANON_PUBLIC_KEY"
};
