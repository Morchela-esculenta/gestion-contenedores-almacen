const stockService = {
  async load() {
    try {
      const { data, error } = await sbClient
        .from('stock_actual')
        .select('*')
        .order('fila_numero');
      if (error) throw error;
      return data && data.length > 0 ? data : null;
    } catch (err) {
      console.error('[Stock] Error al cargar:', err.message);
      return null;
    }
  },

  async saveAll(rows) {
    try {
      const records = rows.slice(1).map(row => ({
        fila_numero: row.rn,
        zona: row.zone,
        referencia: row.ref || null,
        cantidad: row.cnt,
        capacidad: row.cap,
        updated_at: new Date().toISOString()
      }));
      const { error } = await sbClient
        .from('stock_actual')
        .upsert(records, { onConflict: 'fila_numero' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Stock] Error al guardar todo:', err.message);
      return false;
    }
  },

  async saveRow(row) {
    try {
      const { error } = await sbClient
        .from('stock_actual')
        .upsert({
          fila_numero: row.rn,
          zona: row.zone,
          referencia: row.ref || null,
          cantidad: row.cnt,
          capacidad: row.cap,
          updated_at: new Date().toISOString()
        }, { onConflict: 'fila_numero' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Stock] Error al guardar fila:', err.message);
      return false;
    }
  }
};
