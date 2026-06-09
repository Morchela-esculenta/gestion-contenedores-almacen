// MVP: conexión pública sin autenticación
// IMPORTANTE: sustituir por auth real cuando se añadan usuarios
const sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
