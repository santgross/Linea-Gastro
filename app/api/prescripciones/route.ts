import { NextResponse } from 'next/server';
import { getPrescripciones, savePrescripcion } from '../../../lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo');
    const provincia = searchParams.get('provincia');
    const producto = searchParams.get('producto');

    let data = await getPrescripciones();

    if (periodo && periodo !== 'all') {
      data = data.filter((p) => p.periodo === periodo);
    }
    if (provincia && provincia !== 'all') {
      data = data.filter((p) => p.provincia.toLowerCase() === provincia.toLowerCase());
    }
    if (producto && producto !== 'all') {
      data = data.filter((p) => p.producto_id === producto);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al obtener prescripciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    } = body;

    // Validación básica de campos requeridos
    if (!periodo || !laboratorio || !marca || !provincia || rx_total === undefined) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
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

    return NextResponse.json({ success: true, data: newPresc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al guardar prescripción' },
      { status: 500 }
    );
  }
}
