import { createBrowserClient } from '@supabase/ssr';
import { Producto, MercadoATC, Prescripcion } from './types';

export function createClient() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (url.endsWith('/rest/v1/')) {
    url = url.slice(0, -9);
  } else if (url.endsWith('/rest/v1')) {
    url = url.slice(0, -8);
  }
  return createBrowserClient(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Check configuration status for graceful fallback
const hasSupabaseEnv = typeof process !== 'undefined' && 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ==========================================
// SEED DATA REALISTA PARA EL MODO DEMO/FALLBACK
// ==========================================

export const SEED_PRODUCTOS: Producto[] = [
  { id: 'p-1', codigo: 'GASTRIL', nombre: 'Gastril', molecula: 'Sucralfato', clase_atc: 'A02B9', codigo_mdo: 'MDO A02B9', activo: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'p-2', codigo: 'BIOFIT', nombre: 'Biofit', molecula: 'Psyllium', clase_atc: 'A06A3', codigo_mdo: 'MDO A06A3', activo: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'p-3', codigo: 'ILUNOX', nombre: 'Ilunox', molecula: 'PEG 3350', clase_atc: 'A06A6', codigo_mdo: 'MDO A06A6', activo: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'p-4', codigo: 'URSOCEL', nombre: 'Ursocel', molecula: 'Ácido ursodesoxicólico', clase_atc: 'A05A2', codigo_mdo: 'MDO A05A2', activo: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'p-5', codigo: 'HEPABRAND', nombre: 'Hepabrand', molecula: 'L-ornitina + L-aspartato', clase_atc: 'A05B', codigo_mdo: 'MDO A05B', activo: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'p-6', codigo: 'OMECIDOL', nombre: 'Omecidol', molecula: 'Omeprazol 40mg', clase_atc: 'A02B2', codigo_mdo: 'MDO A02B2', activo: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'p-7', codigo: 'OMEFAST', nombre: 'Omefast', molecula: 'Omeprazol 20mg + bicarbonato', clase_atc: 'A02B2', codigo_mdo: 'MDO A02B2', activo: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'p-8', codigo: 'SIMATROL', nombre: 'Simatrol Q', molecula: 'Silimarina + Resveratrol + CoQ10', clase_atc: 'A05B', codigo_mdo: 'MDO A05B', activo: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'p-9', codigo: 'HELICOPACK', nombre: 'Helicopack', molecula: 'Claritromicina + Tinidazol + Omep', clase_atc: 'A02B2', codigo_mdo: 'MDO A02B2', activo: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'p-10', codigo: 'RIFANORM', nombre: 'Rifanorm', molecula: 'Rifaximina', clase_atc: 'A07A', codigo_mdo: 'MDO A07A', activo: true, created_at: '2025-01-01T00:00:00Z' },
];

export const SEED_MERCADOS: MercadoATC[] = [
  { id: 'm-1', codigo: 'A02B9', descripcion: 'Antiulcerosos protectores mucosa', producto_farlogran_id: 'p-1' },
  { id: 'm-2', codigo: 'A06A3', descripcion: 'Laxantes formadores de volumen', producto_farlogran_id: 'p-2' },
  { id: 'm-3', codigo: 'A06A6', descripcion: 'Laxantes osmóticos activos', producto_farlogran_id: 'p-3' },
  { id: 'm-4', codigo: 'A05A2', descripcion: 'Terapia con ácidos biliares (hepatoprotectores)', producto_farlogran_id: 'p-4' },
  { id: 'm-5', codigo: 'A05B', descripcion: 'Terapia lipotrópica y hepática', producto_farlogran_id: 'p-5' },
  { id: 'm-6', codigo: 'A02B2', descripcion: 'Inhibidores de la bomba de protones (IBP)', producto_farlogran_id: 'p-6' },
  { id: 'm-7', codigo: 'A07A', descripcion: 'Antiinfecciosos intestinales', producto_farlogran_id: 'p-10' },
];

// Generar historial de prescripciones realistas para los últimos 6 meses
const PERIODOS = ['2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];
const PROVINCIAS = ['Madrid', 'Barcelona', 'Andalucía', 'Euskadi', 'Galicia', 'Valencia'];

const COMPETENCIAL_MAPPING: Record<string, { marca: string, lab: string }[]> = {
  'p-1': [ // Gastril (Sucralfato)
    { marca: 'Sucralan', lab: 'ROVI' },
    { marca: 'Almax', lab: 'ALMIRALL' },
  ],
  'p-2': [ // Biofit (Psyllium)
    { marca: 'Metamucil', lab: 'P&G' },
    { marca: 'Cenat', lab: 'MADAUS' },
  ],
  'p-3': [ // Ilunox (PEG 3350)
    { marca: 'Contumax', lab: 'FAES' },
    { marca: 'Movicol', lab: 'NORGINE' },
  ],
  'p-4': [ // Ursocel (Ácido ursodesoxicólico)
    { marca: 'Ursobilane', lab: 'ESTEVE' },
    { marca: 'Intestifalk', lab: 'FALK' },
  ],
  'p-5': [ // Hepabrand (L-ornitina + L-aspartato)
    { marca: 'Hepa-Merz', lab: 'MERZ' },
    { marca: 'Hepafast', lab: 'PHARMA' },
  ],
  'p-6': [ // Omecidol (Omeprazol 40mg)
    { marca: 'Losec 40', lab: 'ASTRAZENECA' },
    { marca: 'Omeprazol Sandoz', lab: 'SANDOZ' },
  ],
  'p-7': [ // Omefast (Omeprazol 20mg + Bicarbonato)
    { marca: 'Pilosec Duo', lab: 'ROEMMERS' },
    { marca: 'Gasec Duo', lab: 'TAKEDA' },
  ],
  'p-8': [ // Simatrol Q
    { marca: 'Silimarin Forte', lab: 'MEDA' },
    { marca: 'Legalon', lab: 'MADAUS' },
  ],
  'p-9': [ // Helicopack
    { marca: 'Pylera', lab: 'ALLERGAN' },
    { marca: 'Helicobacter Pack G', lab: 'SANDOZ' },
  ],
  'p-10': [ // Rifanorm (Rifaximina)
    { marca: 'Normix', lab: 'ALFASIGMA' },
    { marca: 'Spiraxin', lab: 'KERN' },
  ]
};

function generarPrescripcionesDummy(): Prescripcion[] {
  const result: Prescripcion[] = [];
  let idCounter = 1;

  SEED_PRODUCTOS.forEach((prod) => {
    const mercado = SEED_MERCADOS.find(m => m.codigo === prod.clase_atc) || SEED_MERCADOS[0];
    const competidores = COMPETENCIAL_MAPPING[prod.id] || [{ marca: 'Generico Comp', lab: 'COMPETENCIA' }];

    PERIODOS.forEach((periodo, pIdx) => {
      const factorEvolucion = 1 + (pIdx * 0.04) + (Math.sin(pIdx) * 0.02);

      PROVINCIAS.forEach((provincia) => {
        // Generar propia (PHARMABRAND)
        const rxPropiaBase = prod.codigo === 'RIFANORM' ? 450 
                           : prod.codigo === 'GASTRIL' ? 320 
                           : prod.codigo === 'OMECIDOL' ? 1200
                           : prod.codigo === 'OMEFAST' ? 800
                           : 250;
        
        const tamAnteriorPropia = Math.round(rxPropiaBase * (factorEvolucion - 0.05) * (0.8 + Math.random() * 0.4));
        const tamActualPropia = Math.round(rxPropiaBase * factorEvolucion * (0.8 + Math.random() * 0.4));
        const rxTotalPropia = tamActualPropia;
        const pctCrecPropia = tamAnteriorPropia > 0 
          ? Number(((tamActualPropia - tamAnteriorPropia) / tamAnteriorPropia * 100).toFixed(2)) 
          : 0.0;

        let sumaRxTotalMercado = tamActualPropia;
        const compet_items: { marca: string, lab: string, tamAnt: number, tamAct: number }[] = [];

        competidores.forEach((comp, cIdx) => {
          const pesoComp = cIdx === 0 ? 1.4 : 0.8;
          const tamAnteriorComp = Math.round(rxPropiaBase * pesoComp * (factorEvolucion - 0.03) * (0.8 + Math.random() * 0.4));
          const tamActualComp = Math.round(rxPropiaBase * pesoComp * factorEvolucion * (0.8 + Math.random() * 0.4));
          sumaRxTotalMercado += tamActualComp;

          compet_items.push({
            marca: comp.marca,
            lab: comp.lab,
            tamAnt: tamAnteriorComp,
            tamAct: tamActualComp
          });
        });

        const sharePropio = Number(((tamActualPropia / sumaRxTotalMercado) * 100).toFixed(2));
        result.push({
          id: `dep-${idCounter++}`,
          periodo,
          laboratorio: 'PHARMABRAND',
          marca: prod.nombre,
          producto_id: prod.id,
          mercado_atc_id: mercado.id,
          provincia,
          rx_total: rxTotalPropia,
          tam_anterior: tamAnteriorPropia,
          tam_actual: tamActualPropia,
          pct_crecimiento: pctCrecPropia,
          pct_share: sharePropio,
          created_at: new Date().toISOString()
        });

        compet_items.forEach((c) => {
          const shareComp = Number(((c.tamAct / sumaRxTotalMercado) * 100).toFixed(2));
          const pctCrecComp = c.tamAnt > 0 
            ? Number(((c.tamAct - c.tamAnt) / c.tamAnt * 100).toFixed(2)) 
            : 0.0;

          result.push({
            id: `dep-${idCounter++}`,
            periodo,
            laboratorio: c.lab,
            marca: c.marca,
            producto_id: prod.id,
            mercado_atc_id: mercado.id,
            provincia,
            rx_total: c.tamAct,
            tam_anterior: c.tamAnt,
            tam_actual: c.tamAct,
            pct_crecimiento: pctCrecComp,
            pct_share: shareComp,
            created_at: new Date().toISOString()
          });
        });

      });
    });
  });

  return result;
}

export const SEED_PRESCRIPCIONES: Prescripcion[] = generarPrescripcionesDummy();

// ==========================================
// CENTRALIZADORES DE ACCESO A DATOS (DEMO / SUPABASE)
// ==========================================

export async function getProductos(): Promise<Producto[]> {
  if (hasSupabaseEnv) {
    try {
      const client = createClient();
      const { data, error } = await client.from('productos').select('*').order('nombre', { ascending: true });
      if (!error && data) return data as Producto[];
    } catch (err) {
      console.warn("Disparo fallback para productos", err);
    }
  }
  
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('fg_productos');
    if (cached) return JSON.parse(cached);
    localStorage.setItem('fg_productos', JSON.stringify(SEED_PRODUCTOS));
  }
  return SEED_PRODUCTOS;
}

export async function updateProducto(id: string, updates: Partial<Producto>): Promise<Producto> {
  if (hasSupabaseEnv) {
    try {
      const client = createClient();
      const { data, error } = await client.from('productos').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Producto;
    } catch (err) {
      console.warn("Error actualizando producto en Supabase", err);
    }
  }
  
  const list = await getProductos();
  const idx = list.findIndex(p => p.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem('fg_productos', JSON.stringify(list));
    }
    return list[idx];
  }
  throw new Error('Producto no encontrado');
}

export async function getMercados(): Promise<MercadoATC[]> {
  if (hasSupabaseEnv) {
    try {
      const client = createClient();
      const { data, error } = await client.from('mercados_atc').select('*');
      if (!error && data) return data as MercadoATC[];
    } catch (err) {
      console.warn("Fallback mercados", err);
    }
  }
  return SEED_MERCADOS;
}

export async function getPrescripciones(): Promise<Prescripcion[]> {
  if (hasSupabaseEnv) {
    try {
      const client = createClient();
      const { data, error } = await client.from('prescripciones').select('*');
      if (!error && data) return data as Prescripcion[];
    } catch (err) {
      console.warn("Fallback prescripciones", err);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('fg_prescripciones');
    if (cached) return JSON.parse(cached);
    localStorage.setItem('fg_prescripciones', JSON.stringify(SEED_PRESCRIPCIONES));
  }
  return SEED_PRESCRIPCIONES;
}

export async function savePrescripcion(prescripcion: Omit<Prescripcion, 'id' | 'created_at'>): Promise<Prescripcion> {
  if (hasSupabaseEnv) {
    try {
      const client = createClient();
      const { data, error } = await client.from('prescripciones').insert({
        ...prescripcion,
      }).select().single();
      if (!error && data) return data as Prescripcion;
    } catch (err) {
      console.warn("Error guardando prescripción en Supabase", err);
    }
  }

  const list = await getPrescripciones();
  const newItem: Prescripcion = {
    ...prescripcion,
    id: `dep-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  list.push(newItem);
  if (typeof window !== 'undefined') {
    localStorage.setItem('fg_prescripciones', JSON.stringify(list));
  }
  return newItem;
}
