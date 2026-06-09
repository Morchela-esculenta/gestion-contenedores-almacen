function _getDeviceId() {
  let id = localStorage.getItem('almacen_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem('almacen_device_id', id);
  }
  return id;
}

const movementService = {
  async log({ referencia, accion, cantidad, fila_numero, zona, stock_anterior, stock_nuevo, nota }) {
    try {
      const { error } = await sbClient
        .from('movimientos_stock')
        .insert({
          referencia: referencia || null,
          accion,
          cantidad: cantidad ?? null,
          fila_numero: fila_numero ?? null,
          zona: zona || null,
          stock_anterior: stock_anterior ?? null,
          stock_nuevo: stock_nuevo ?? null,
          nota: nota || null,
          dispositivo: _getDeviceId()
        });
      if (error) throw error;
    } catch (err) {
      console.error('[Movimiento] Error al registrar:', err.message);
    }
  }
};
