// MVP: conexión pública sin autenticación
// IMPORTANTE: sustituir por auth real cuando se añadan usuarios
// La anon key es pública por diseño — la service_role key nunca debe estar aquí
var sbClient = supabase.createClient(
  'https://xrzjyfmavkrhujxruaak.supabase.co',
  'sb_publishable__NIyYPjzvaNHNPh3JooBXA_FtBUYiv-'
);
