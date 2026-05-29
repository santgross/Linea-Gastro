import { NextResponse } from 'next/server';
import { getProductos, getPrescripciones } from '../../../lib/supabase';

export async function GET() {
  try {
    const products = await getProductos();
    const activeProducts = products.filter((p) => p.activo);
    const prescriptions = await getPrescripciones();

    const data = activeProducts.map((product) => {
      // Filtrar prescripciones asociadas a este producto
      const productPrescriptions = prescriptions.filter((p) => p.producto_id === product.id);
      
      const pharmabrandPrescriptions = productPrescriptions.filter((p) => p.laboratorio === 'PHARMABRAND');
      const competitorPrescriptions = productPrescriptions.filter((p) => p.laboratorio !== 'PHARMABRAND');

      // Calcular TAM Actual y Anterior sumando los valores individuales de Pharmabrand
      const tam_actual = pharmabrandPrescriptions.reduce((sum, p) => sum + (p.tam_actual || p.rx_total || 0), 0);
      const tam_anterior = pharmabrandPrescriptions.reduce((sum, p) => sum + (p.tam_anterior || 0), 0);
      
      // Calcular % Crecimiento
      const pct_crecimiento = tam_anterior > 0 
        ? Number((((tam_actual - tam_anterior) / tam_anterior) * 100).toFixed(2)) 
        : 0;

      // Calcular % Share basado en el total registrado
      const totalPharmabrandRx = pharmabrandPrescriptions.reduce((sum, p) => sum + (p.rx_total || 0), 0);
      const totalCompetitorRx = competitorPrescriptions.reduce((sum, p) => sum + (p.rx_total || 0), 0);
      const totalMercadoRx = totalPharmabrandRx + totalCompetitorRx;

      const pct_share = totalMercadoRx > 0 
        ? Number(((totalPharmabrandRx / totalMercadoRx) * 100).toFixed(2)) 
        : 0;

      return {
        ...product,
        tam_actual,
        tam_anterior,
        pct_crecimiento,
        pct_share
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al obtener productos' },
      { status: 500 }
    );
  }
}
