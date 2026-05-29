export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  molecula: string | null;
  clase_atc: string | null;
  codigo_mdo: string | null;
  activo: boolean;
  created_at: string;
}

export interface MercadoATC {
  id: string;
  codigo: string;
  descripcion: string | null;
  producto_farlogran_id: string | null;
}

export interface Prescripcion {
  id: string;
  periodo: string; // 'YYYY-MM'
  laboratorio: string; // 'PHARMABRAND' o nombre competentador
  marca: string;
  producto_id: string | null;
  mercado_atc_id: string | null;
  provincia: string | null;
  rx_total: number;
  tam_anterior: number;
  tam_actual: number;
  pct_crecimiento: number | null; // porcentaje de crecimiento
  pct_share: number | null; // porcentaje de share de mercado
  created_at: string;
}
