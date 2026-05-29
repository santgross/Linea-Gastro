import { Router, Request, Response } from 'express';
import { getPrescripciones, savePrescripcion } from '../../../lib/supabase';

const router = Router();

// GET: devuelve prescripciones filtradas por periodo, provincia, producto
router.get('/', async (req: Request, res: Response) => {
  try {
    const { periodo, provincia, producto } = req.query;
    let data = await getPrescripciones();

    if (periodo && typeof periodo === 'string' && periodo !== 'all') {
      data = data.filter((p) => p.periodo === periodo);
    }
    if (provincia && typeof provincia === 'string' && provincia !== 'all') {
      data = data.filter((p) => p.provincia.toLowerCase() === provincia.toLowerCase());
    }
    if (producto && typeof producto === 'string' && producto !== 'all') {
      data = data.filter((p) => p.producto_id === producto);
    }

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error al obtener prescripciones' });
  }
});

// POST: inserta nuevos registros
router.post('/', async (req: Request, res: Response) => {
  try {
    const { 
      periodo, 
      laboratorio, 
      marca, 
      producto_id, 
      mercado_atc_id, 
      provincia, 
      rx_total, 
      tam_anterior, 
      tam_actual, 
      pct_crecimiento, 
      pct_share 
    } = req.body;

    // Validación básica de campos requeridos
    if (!periodo || !laboratorio || !marca || !provincia || rx_total === undefined) {
      return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
    }

    const newPresc = await savePrescripcion({
      periodo,
      laboratorio,
      marca,
      producto_id: producto_id || null,
      mercado_atc_id: mercado_atc_id || null,
      provincia,
      rx_total: Number(rx_total),
      tam_anterior: tam_anterior ? Number(tam_anterior) : 0,
      tam_actual: tam_actual ? Number(tam_actual) : Number(rx_total),
      pct_crecimiento: pct_crecimiento ? Number(pct_crecimiento) : 0,
      pct_share: pct_share ? Number(pct_share) : 0,
    });

    res.status(201).json({ success: true, data: newPresc });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error al guardar prescripción' });
  }
});

export default router;
