'use client';

import React, { useState, useEffect } from 'react';
import { 
  getProductos, 
  getPrescripciones, 
  getMercados,
  updateProducto
} from '../../../../lib/supabase';
import { Producto, Prescripcion, MercadoATC } from '../../../../lib/types';

import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';

import RxEvolutionChart from '../../../../components/charts/RxEvolutionChart';
import MarketShareChart from '../../../../components/charts/MarketShareChart';

import { 
  ChevronLeft, 
  Pill, 
  Activity, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  Compass, 
  ShieldAlert, 
  GitCompare,
  Home,
  Database
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
}

export default function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [prescripciones, setPrescripciones] = useState<Prescripcion[]>([]);
  const [mercados, setMercados] = useState<MercadoATC[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);

  // Cargar datos del producto específico
  const loadProductData = async () => {
    setLoading(true);
    try {
      const allProds = await getProductos();
      const currentProd = allProds.find(p => p.id === productId) || null;
      setProducto(currentProd);

      const allPresc = await getPrescripciones();
      // Filtrar prescripciones asociadas a este producto específico
      const filteredPresc = allPresc.filter(p => p.producto_id === productId);
      setPrescripciones(filteredPresc);

      const allMercs = await getMercados();
      setMercados(allMercs);

    } catch (err) {
      console.error('Error al cargar detalle del producto', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductData();
  }, [productId]);

  // Alternar el estado activo desde el detalle del producto
  const handleToggleStatus = async () => {
    if (!producto) return;
    setSavingStatus(true);
    try {
      const updated = await updateProducto(producto.id, { activo: !producto.activo });
      setProducto(updated);
    } catch (err) {
      console.error('Error al cambiar estatus', err);
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-[#1A1D2E] rounded-2xl border border-[#8892b01a] space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-t-[#00C9A7] border-[#8892b01a] animate-spin" />
        <p className="text-xs text-gray-400 font-mono">Analizando variables del catálogo...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <Card className="text-center p-12">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Producto No Encontrado</h3>
        <p className="text-xs text-gray-400 mb-6 font-light">
          La fórmula seleccionada no existe en la base de datos de Pharmabrand S.A.
        </p>
        <Button onClick={onBack} variant="primary">
          Regresar al Dashboard
        </Button>
      </Card>
    );
  }

  // ==========================================
  // CALCULOS Y AGREGACIONES PROPIAS DE LA FÓRMULA
  // ==========================================

  // Mercado ATC del producto
  const mercadoAsociado = mercados.find(m => m.codigo === producto.clase_atc);

  // 1. Filtrar solo marcas de Pharmabrand S.A. (propias) y competidores
  const prescFarl = prescripciones.filter(p => p.laboratorio === 'PHARMABRAND');
  const prescComp = prescripciones.filter(p => p.laboratorio !== 'PHARMABRAND');

  // Sumas colectivas de prescripciones
  const totalFarlogranRx = prescFarl.reduce((sum, p) => sum + p.rx_total, 0);
  const totalCompetenciaRx = prescComp.reduce((sum, p) => sum + p.rx_total, 0);
  const totalMercadoRx = totalFarlogranRx + totalCompetenciaRx;

  // Cuota media del producto
  const cuotaMedia = totalMercadoRx > 0 
    ? (totalFarlogranRx / totalMercadoRx) * 100 
    : 0;

  // TAM Actual global para este producto
  const tamActualPropio = prescFarl.reduce((sum, p) => sum + p.tam_actual, 0);
  const tamAnteriorPropio = prescFarl.reduce((sum, p) => sum + p.tam_anterior, 0);
  const crecimientoPropio = tamAnteriorPropio > 0
    ? ((tamActualPropio - tamAnteriorPropio) / tamAnteriorPropio) * 100
    : 0;

  // ==========================================
  // CONFIGURACIÓN DE LOS GRÁFICOS INTERNOS
  // ==========================================

  // Historial temporal comprimido (Agrupado por mes)
  const periodosDisponibles = Array.from(new Set(prescripciones.map(p => p.periodo))).sort() as string[];
  const evolutionChartData = periodosDisponibles.map((periodo) => {
    const itemsPeriodo = prescripciones.filter(p => p.periodo === periodo);
    const rxFarlogran = itemsPeriodo.filter(p => p.laboratorio === 'PHARMABRAND').reduce((sum, p) => sum + p.rx_total, 0);
    const rxCompetencia = itemsPeriodo.filter(p => p.laboratorio !== 'PHARMABRAND').reduce((sum, p) => sum + p.rx_total, 0);

    return {
      periodo,
      rxFarlogran,
      rxCompetencia,
      total: rxFarlogran + rxCompetencia
    };
  });

  // Agrupar por marca del último período para el share
  const ultimoPeriodo = periodosDisponibles[periodosDisponibles.length - 1] || '2026-05';
  const prescripcionesUltimoPeriodo = prescripciones.filter(p => p.periodo === ultimoPeriodo);

  const marcaRxMap: Record<string, { rx: number, lab: string }> = {};
  prescripcionesUltimoPeriodo.forEach((p) => {
    if (!marcaRxMap[p.marca]) {
      marcaRxMap[p.marca] = { rx: 0, lab: p.laboratorio };
    }
    marcaRxMap[p.marca].rx += p.rx_total;
  });

  const totalPeriodoRx = Object.values(marcaRxMap).reduce((sum, item) => sum + item.rx, 0);
  const pieChartData = Object.keys(marcaRxMap).map((marca) => {
    const item = marcaRxMap[marca];
    return {
      name: marca,
      value: totalPeriodoRx > 0 ? (item.rx / totalPeriodoRx) * 100 : 0,
      laboratorio: item.lab,
    };
  }).sort((a, b) => b.value - a.value);

  // Evolución de prescripciones por provincia
  const provinciasDisponibles = Array.from(new Set(prescripcionesUltimoPeriodo.map(p => p.provincia)));
  const provinciaBreakdownData = provinciasDisponibles.map((prov) => {
    const itemsProv = prescripcionesUltimoPeriodo.filter(p => p.provincia === prov);
    const farlogranRx = itemsProv.filter(p => p.laboratorio === 'PHARMABRAND').reduce((sum, p) => sum + p.rx_total, 0);
    const compRx = itemsProv.filter(p => p.laboratorio !== 'PHARMABRAND').reduce((sum, p) => sum + p.rx_total, 0);
    const totalRx = farlogranRx + compRx;
    const share = totalRx > 0 ? (farlogranRx / totalRx) * 100 : 0;

    return {
      provincia: prov,
      farlogranRx,
      competidorRx: compRx,
      share
    };
  }).sort((a, b) => b.farlogranRx - a.farlogranRx);

  return (
    <div className="space-y-6 text-[#F3F4F6]">
      
      {/* Back navigation header row */}
      <div className="flex items-center justify-between border-b border-[#8892b01a] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white font-mono cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="muted">ATC: {producto.clase_atc}</Badge>
          <span className="text-xs text-gray-500 font-mono">ID: {producto.codigo}</span>
        </div>
      </div>

      {/* Hero Header with Brand Summary */}
      <Card className="relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C9A7]/5 rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00C9A71a] border border-[#00C9A733] flex items-center justify-center shrink-0 mt-1">
              <Pill className="w-6 h-6 text-[#00C9A7]" />
            </div>
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-white tracking-wide font-display">
                  {producto.nombre}
                </h1>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  producto.activo 
                    ? 'bg-[#00C9A71a] text-[#00C9A7] border-[#00C9A733]' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/15'
                }`}>
                  {producto.activo ? '● ACTIVO EN LÍNEA' : '○ EXCLUIDO'}
                </span>
              </div>
              
              <p className="text-sm text-gray-400 italic font-light">
                {producto.molecula} — {mercadoAsociado ? mercadoAsociado.descripcion : 'Clase terapéutica G.'}
              </p>

              <p className="text-xs text-[#8892b0] max-w-2xl font-light leading-relaxed">
                Esta ficha técnica monitorea las recetas médicas en las provincias auditadas. Revise a continuación los desgloses territoriales y el desempeño en comparación con las principales marcas competidoras.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Button
              variant={producto.activo ? 'danger' : 'primary'}
              onClick={handleToggleStatus}
              disabled={savingStatus}
              className="py-2.5 font-bold"
            >
              {savingStatus ? 'Actualizando...' : producto.activo ? 'Suspender del Catálogo' : 'Activar Comercialización'}
            </Button>
            <span className="text-[10px] text-gray-500 font-mono text-center block">
              Control rápido de estatus de delegado
            </span>
          </div>

        </div>
      </Card>

      {/* Focused Medical Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Card className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#8892b0] font-semibold uppercase font-display tracking-wider">
              Recetas Pharmabrand S.A.
            </span>
            <p className="text-2xl font-extrabold text-white font-display">
              {totalFarlogranRx.toLocaleString()} Rx
            </p>
            <span className="text-[10px] text-[#8892b0] block font-light">
              Acumulado de muestras seleccionadas
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#00C9A71a] text-[#00C9A7] border border-[#00C9A733]">
            <Activity className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#8892b0] font-semibold uppercase font-display tracking-wider">
              Participación de Mercado M.
            </span>
            <p className="text-2xl font-extrabold text-white font-display">
              {cuotaMedia.toFixed(1)}%
            </p>
            <span className="text-[10px] text-[#8892b0] block font-light">
              Cuota de prescripción frente a competidores
            </span>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/15">
            <GitCompare className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#8892b0] font-semibold uppercase font-display tracking-wider">
              Crecimiento (Evol. TAM)
            </span>
            <p className={`text-2xl font-extrabold font-display ${crecimientoPropio >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {crecimientoPropio >= 0 ? '+' : ''}{crecimientoPropio.toFixed(1)}%
            </p>
            <span className="text-[10px] text-[#8892b0] block font-light">
              Desviación TAM actual vs TAM anterior
            </span>
          </div>
          <div className={`p-3 rounded-lg border ${crecimientoPropio >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' : 'bg-rose-500/10 text-rose-400 border-rose-500/15'}`}>
            {crecimientoPropio >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        </Card>

      </div>

      {/* Main comparative graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* Evolution area chart */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase font-display">
                Evolución Temporal de Prescripciones
              </h3>
              <p className="text-[11px] text-[#8892b0] font-light mt-0.5">
                Volumen mensual de {producto.nombre} contra marcas competidoras en el mercado ATC.
              </p>
            </div>
            <RxEvolutionChart data={evolutionChartData} />
          </Card>
        </div>

        {/* Share donut chart */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase font-display">
                Cuotas de Mercado ({ultimoPeriodo})
              </h3>
              <p className="text-[11px] text-[#8892b0] font-light mt-0.5">
                Participación porcentual en el mercado ATC {producto.clase_atc}.
              </p>
            </div>
            <MarketShareChart data={pieChartData} />
          </Card>
        </div>

      </div>

      {/* Province audit and competitors analysis list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Provices details block */}
        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-display flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#00C9A7]" />
              <span>Auditoría por Provincias ({ultimoPeriodo})</span>
            </h3>
            <p className="text-[11px] text-[#8892b0] font-light">
              Desglose detallado de recetas, penetración y share territorial.
            </p>
          </div>

          <div className="space-y-3 font-sans">
            {provinciaBreakdownData.map((pb, index) => (
              <div key={index} className="bg-[#0F1117] border border-[#8892b01a] p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{pb.provincia}</h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-[#8892b0]">
                    <span>Propias: <strong className="text-white">{pb.farlogranRx.toLocaleString()} Rx</strong></span>
                    <span>Competidoras: <strong className="text-white">{pb.competidorRx.toLocaleString()} Rx</strong></span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="block text-[10px] text-[#8892b0] font-mono leading-none">Share</span>
                  <strong className="text-lg text-[#00C9A7] font-display block mt-1">{pb.share.toFixed(1)}%</strong>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Competitor Insights and dynamic analytics suggestions */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase font-display flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-blue-400" />
                <span>Análisis Competitivo de Campo</span>
              </h3>
              <p className="text-[11px] text-[#8892b0] font-light">
                Principales marcas activas en la clase ATC {producto.clase_atc} para {producto.molecula}.
              </p>
            </div>

            <div className="divide-y divide-[#8892b01a]">
              {pieChartData.map((item, index) => (
                <div key={index} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.laboratorio === 'PHARMABRAND' ? '#00C9A7' : '#3B82F6' }} />
                    <div>
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-[10px] text-[#8892b0] font-mono ml-2">({item.laboratorio})</span>
                    </div>
                  </div>
                  <strong className="text-white font-mono">{item.value.toFixed(1)}% Cuota</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0F1117] border border-[#8892b01a] p-4 rounded-xl mt-6">
            <span className="text-[10px] font-bold text-[#00C9A7] uppercase font-mono tracking-wider block mb-1">💡 Sugerencia Técnica para Delegado</span>
            <p className="text-[11px] text-[#8892b0] leading-relaxed font-light">
              {cuotaMedia > 35 
                ? `Excelente penetración de ${producto.nombre} en el mercado. Mantenga las visitas médicas recurrentes para afianzar el liderazgo en prescripciones contra competidores.`
                : `${producto.nombre} posee margen de crecimiento. Se sugiere focalizar promociones en las plazas con cuotas inferiores al 25% para reposicionar la marca frente a competidores directos.`}
            </p>
          </div>
        </Card>

      </div>

    </div>
  );
}
