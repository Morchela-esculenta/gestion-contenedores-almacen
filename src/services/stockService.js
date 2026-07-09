const stockService = {
  lastError: null,

  async load() {
    try {
      const { data, error } = await sbClient
        .from('stock_actual')
        .select('*')
        .order('fila_numero');
      if (error) throw error;
      return data && data.length > 0 ? data : null;
    } catch (err) {
      console.error('[Stock] Error al cargar:', err.message, err);
      stockService.lastError = err.message || 'Sin respuesta del servidor';
      return null;
    }
  },

  async saveAll(rows) {
    try {
      const records = rows.slice(1).map(row => ({
        fila_numero:     row.rn,
        zona:            row.zone,
        referencia:      row.ref || null,
        cantidad:        row.cnt,
        capacidad:       row.cap,
        combination_key: row.combinationKey || null,
        cage_items:      null,
        zone_type:       'normal',
        updated_at:      new Date().toISOString()
      }));
      const { error } = await sbClient
        .from('stock_actual')
        .upsert(records, { onConflict: 'fila_numero' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Stock] Error al guardar todo:', err.message, err);
      stockService.lastError = err.message;
      return false;
    }
  },

  async saveRow(row) {
    try {
      const { error } = await sbClient
        .from('stock_actual')
        .upsert({
          fila_numero:     row.rn,
          zona:            row.zone,
          referencia:      row.ref || null,
          cantidad:        row.cnt,
          capacidad:       row.cap,
          combination_key: row.combinationKey || null,
          cage_items:      null,
          zone_type:       'normal',
          updated_at:      new Date().toISOString()
        }, { onConflict: 'fila_numero' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Stock] Error al guardar fila:', err.message, err);
      return false;
    }
  },

  // Guarda una fila de Jaula (puede contener varios items)
  async saveCageRow(cageRow) {
    try {
      const totalCnt = cageRow.items.reduce((s, it) => s + it.cnt, 0);
      const { error } = await sbClient
        .from('stock_actual')
        .upsert({
          fila_numero:     cageRow.rn,
          zona:            'jaula',
          referencia:      null,
          cantidad:        totalCnt,
          capacidad:       cageRow.cap,
          combination_key: null,
          cage_items:      cageRow.items,
          zone_type:       'cage',
          updated_at:      new Date().toISOString()
        }, { onConflict: 'fila_numero' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Stock] Error al guardar fila jaula:', err.message, err);
      return false;
    }
  }
};
