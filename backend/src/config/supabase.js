const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltan SUPABASE_URL o SUPABASE_KEY en el archivo .env');
  process.exit(1);
}

// La clave solo vive en el servidor; el navegador nunca se conecta directo a la base
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

module.exports = supabase;
