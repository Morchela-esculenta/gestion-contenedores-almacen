-- ============================================================
-- MIGRACIÓN: Actualización gestión contenedores v2
-- Ejecutar en Supabase SQL Editor ANTES de desplegar el nuevo código
-- ============================================================

-- stock_actual: añadir columnas para combinación y jaula
ALTER TABLE stock_actual
  ADD COLUMN IF NOT EXISTS combination_key text,
  ADD COLUMN IF NOT EXISTS cage_items      jsonb,
  ADD COLUMN IF NOT EXISTS zone_type       text DEFAULT 'normal';

-- movimientos_stock: añadir trazabilidad de combinación y jaula
ALTER TABLE movimientos_stock
  ADD COLUMN IF NOT EXISTS combination_key text,
  ADD COLUMN IF NOT EXISTS is_cage         boolean DEFAULT false;

-- Normalizar registros existentes sin zone_type
UPDATE stock_actual SET zone_type = 'normal' WHERE zone_type IS NULL;
