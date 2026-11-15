/* Configuração do Supabase (login + banco de dados).
   Pegue os dois valores em: Supabase > seu projeto > Project Settings > API.
   A "anon public key" pode ficar no site: quem protege os dados são as regras (RLS) do arquivo supabase/schema.sql. */
window.MISH_CONFIG = {
  supabaseUrl: "https://dwziqtlseugnizqseyij.supabase.co",
  supabaseAnonKey: "sb_publishable_9yXN_K7P3iGBgOoPXC9g-w_NC3O4aeN",

  /* WhatsApp do Israel para vender o acesso (com DDD, ex.: "11 99999-9999").
     Enquanto estiver vazio, os botões "Compre pelo WhatsApp" não aparecem na tela de login. */
  whatsapp: "21 96739-8334",
  whatsappMensagem: "Quero meu acesso à MISH Precificação."
};
