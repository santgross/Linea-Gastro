'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getProductos, 
  getPrescripciones, 
  getMercados, 
  savePrescripcion,
  updateProducto
} from '../../../lib/supabase';
import { Producto, Prescripcion, MercadoATC } from '../../../lib/types';

import KPIPanel from '../../../components/dashboard/KPIPanel';
import PrescriptionWizard from '../../../components/dashboard/PrescriptionWizard';
import RxEvolutionChart from '../../../components/charts/RxEvolutionChart';
import MarketShareChart from '../../../components/charts/MarketShareChart';
import CompetitorComparisonChart from '../../../components/charts/CompetitorComparisonChart';

import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

import { 
  Filter, 
  Plus, 
  Search, 
  BookOpen, 
  Maximize2, 
  Settings, 
  Pill, 
  DollarSign, 
  ShoppingBag,
  ExternalLink 
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateProduct?: (id: string) => void;
  userEmail?: string;
}

export default function DashboardPage({ onNavigateProduct, userEmail }: DashboardPageProps) {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [prescripciones, setPrescripciones] = useState<Prescripcion[]>([]);
  const [mercados, setMercados] = useState<MercadoATC[]>([]);
  
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cargar datos
  const loadData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      // Intentar fetch a los API routes reales
      const [resProd, resPresc] = await Promise.all([
        fetch('/api/productos').catch(() => null),
        fetch('/api/prescripciones').catch(() => null)
      ]);

      let loadedProds: Producto[] = [];
      let loadedPresc: Prescripcion[] = [];
      let loadedMercs: MercadoATC[] = [];

      let fetchedSuccessfully = false;

      if (resProd && resProd.ok && resPresc && resPresc.ok) {
        const prodData = await resProd.json();
        const prescData = await resPresc.json();
        if (prodData.success && prescData.success) {
          loadedProds = prodData.data;
          loadedPresc = prescData.data;
          fetchedSuccessfully = true;
        }
      }

      // Si el fetch falló o no se configuró Supabase en el servidor, usar fallback demo
      if (!fetchedSuccessfully) {
        loadedProds = await getProductos();
        loadedPresc = await getPrescripciones();
      }

      // Los mercados no tienen API dedicada, se cargan del helper
      loadedMercs = await getMercados();

      setProductos(loadedProds);
      setPrescripciones(loadedPresc);
      setMercados(loadedMercs);
    } catch (err: any) {
      console.error('Error al cargar datos del dashboard', err);
      setErrorMessage('Ocurrió un inconveniente al conectar con el servidor. Cargando modo demostración local...');
      // Fallback absoluto de seguridad
      try {
        setProductos(await getProductos());
        setPrescripciones(await getPrescripciones());
        setMercados(await getMercados());
      } catch (inner) {
        setErrorMessage('Error crítico al iniciar el catálogo de demostración.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Manejar creación de reportes desde el modal de prescripción
  const handleSavePrescription = async (newPrescription: Omit<Prescripcion, 'id' | 'created_at'>) => {
    try {
      const response = await fetch('/api/prescripciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrescription),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          await loadData();
          return;
        }
      }

      // Fallback si no fue exitoso el guardado en la API real
      await savePrescripcion(newPrescription);
      await loadData();
    } catch (err) {
      console.warn('Error al guardar reporte clínico vía API, usando fallback local', err);
      try {
        await savePrescripcion(newPrescription);
        await loadData();
      } catch (fallbackErr) {
        alert('Error al procesar el reporte.');
      }
    }
  };

  // Alternar estado activo de producto directamente en la grilla para rapidez
  const handleToggleProductStatus = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar navegar al detalle del producto
    try {
      await updateProducto(id, { activo: !currentStatus });
      // Actualizar localmente la grilla del catálogo
      setProductos((prev) => 
        prev.map(p => p.id === id ? { ...p, activo: !currentStatus } : p)
      );
    } catch (err) {
      console.error('Error actualizando estado del producto', err);
    }
  };

  // ==========================================
  // FILTRADO DINÁMICO Y COMPUTACIONES DE KPI / CHAT
  // ==========================================

  // 1. Filtrar prescripciones basadas en los dropdowns
  const prescripcionesFiltradas = prescripciones.filter((p) => {
    const matchesProduct = selectedProductFilter === 'all' 
      ? true 
      : p.producto_id === selectedProductFilter;
    
    const matchesProvince = selectedProvinceFilter === 'all'
      ? true
      : p.provincia === selectedProvinceFilter;

    return matchesProduct && matchesProvince;
  });

  // 1b. Filtrado para catálogo de productos (grilla inferior)
  const productosFiltradosCat = productos.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.molecula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // 2. Computar KPIs Farmacéuticos
  // Suma total de prescripciones (solo del laboratorio Pharmabrand S.A.)
  const kpiFarlogranRx = prescripcionesFiltradas
    .filter((p) => p.laboratorio === 'PHARMABRAND')
    .reduce((sum, item) => sum + item.rx_total, 0);

  // Share de mercado medio (promedio weighted o simple de los registros de Pharmabrand S.A. correspondientes)
  const registrosFarlogran = prescripcionesFiltradas.filter((p) => p.laboratorio === 'PHARMABRAND');
  
  // Agrupar por marca del mercado para calcular cuotas correspondientes
  const totalMercadoRxFiltrado = prescripcionesFiltradas.reduce((sum, p) => sum + p.rx_total, 0);
  const kpiAverageShare = totalMercadoRxFiltrado > 0 
    ? (kpiFarlogranRx / totalMercadoRxFiltrado) * 100 
    : 0;

  // Promedio de PCT de crecimiento para registros Farlogran
  const kpiGrowthRate = registrosFarlogran.length > 0
    ? registrosFarlogran.reduce((sum, p) => sum + Number(p.pct_crecimiento || 0), 0) / registrosFarlogran.length
    : 0;

  // Producto Pharmabrand S.A. con mayor prescripciones (Líder del período filtrado)
  const productRxMap: Record<string, number> = {};
  registrosFarlogran.forEach((p) => {
    const prodName = p.marca;
    productRxMap[prodName] = (productRxMap[prodName] || 0) + p.rx_total;
  });
  let kpiTopProduct = '';
  let maxRxVal = -1;
  Object.keys(productRxMap).forEach((name) => {
    if (productRxMap[name] > maxRxVal) {
      maxRxVal = productRxMap[name];
      kpiTopProduct = name;
    }
  });

  // ==========================================
  // CALCULOS DE DATASET PARA LOS GRÁFICOS
  // ==========================================

  // Gráfico 1: Evolución temporal por Período
  // Agrupar por 'periodo' sumando Pharmabrand S.A. vs Competencia
  const periodosDisponibles = Array.from(new Set(prescripcionesFiltradas.map(p => p.periodo))).sort() as string[];
  const evolutionChartData = periodosDisponibles.map((periodo) => {
    const itemsPeriodo = prescripcionesFiltradas.filter(p => p.periodo === periodo);
    
    const rxFarlogran = itemsPeriodo
      .filter(p => p.laboratorio === 'PHARMABRAND')
      .reduce((sum, item) => sum + item.rx_total, 0);
      
    const rxCompetencia = itemsPeriodo
      .filter(p => p.laboratorio !== 'PHARMABRAND')
      .reduce((sum, item) => sum + item.rx_total, 0);

    return {
      periodo,
      rxFarlogran,
      rxCompetencia,
      total: rxFarlogran + rxCompetencia
    };
  });

  // Gráfico 2: Cuota de Mercado por Marca (Se toman marcas únicas filtradas en el período actual '2026-05' o el último disponible)
  const ultimoPeriodo = periodosDisponibles[periodosDisponibles.length - 1] || '2026-05';
  const prescripcionesUltimoPeriodo = prescripcionesFiltradas.filter(p => p.periodo === ultimoPeriodo);
  
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
  }).sort((a, b) => b.value - a.value); // Ordenar descendente por share

  // Gráfico 3: Comparación Competitiva TAM Actual vs TAM Anterior (por Marca para periodo actual)
  const competitorBarData = Object.keys(marcaRxMap).map((marca) => {
    const itemsMarca = prescripcionesUltimoPeriodo.filter(p => p.marca === marca);
    const tamAnteriorSum = itemsMarca.reduce((sum, p) => sum + p.tam_anterior, 0);
    const tamActualSum = itemsMarca.reduce((sum, p) => sum + p.tam_actual, 0);
    const crecimientoMedio = tamAnteriorSum > 0 
      ? ((tamActualSum - tamAnteriorSum) / tamAnteriorSum) * 100 
      : 0;

    return {
      marca,
      laboratorio: marcaRxMap[marca].lab,
      tamAnterior: tamAnteriorSum,
      tamActual: tamActualSum,
      crecimiento: crecimientoMedio
    };
  }).slice(0, 8); // Tomar las 8 marcas principales para no saturar el gráfico

  return (
    <div className="space-y-6 text-[#F3F4F6]">
      
      {/* Upper header action block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide font-display">
            Línea Gastro — Pharmabrand S.A.
          </h2>
          <p className="text-xs text-[#8892b0] font-light">
            Inteligencia comercial · Gastroenterología
          </p>
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Reportar Prescripción</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 px-4 text-xs text-amber-300 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#1A1D2E] rounded-2xl border border-[#8892b01a] space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-t-[#00C9A7] border-[#8892b01a] animate-spin" />
          <p className="text-xs text-gray-400 font-mono">Cargando base de datos Pharmabrand S.A....</p>
        </div>
      ) : (
        <>
          {/* Dynamic Filter Controls Panel */}
          <div className="bg-[#1A1D2E] border border-[#8892b01a] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#00C9A7]" />
              <span className="text-xs font-semibold text-white tracking-wider uppercase font-display">
                Filtros Activos
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Product selector */}
              <div className="space-y-1">
                <span className="block text-[10px] text-gray-400 font-medium">Fórmula / Producto</span>
                <select
                  value={selectedProductFilter}
                  onChange={(e) => setSelectedProductFilter(e.target.value)}
                  className="bg-[#0F1117] border border-[#8892b022] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="all">Suma Portafolio (Todos)</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} ({p.molecula})
                    </option>
                  ))}
                </select>
              </div>

              {/* Province selector */}
              <div className="space-y-1">
                <span className="block text-[10px] text-gray-400 font-medium">Territorio Regional</span>
                <select
                  value={selectedProvinceFilter}
                  onChange={(e) => setSelectedProvinceFilter(e.target.value)}
                  className="bg-[#0F1117] border border-[#8892b022] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="all">Consolidado Nacional</option>
                  <option value="Madrid">Madrid</option>
                  <option value="Barcelona">Barcelona</option>
                  <option value="Andalucía">Andalucía</option>
                  <option value="Euskadi">Euskadi</option>
                  <option value="Galicia">Galicia</option>
                  <option value="Valencia">Valencia</option>
                </select>
              </div>

              {/* Quick statistics badge */}
              <div className="bg-[#0f1117] border border-[#8892b01a] px-3 py-2 rounded-xl text-left hidden md:block">
                <span className="block text-[9px] text-[#8892b0] uppercase font-mono">Registros</span>
                <span className="text-xs text-[#00C9A7] font-bold font-mono">
                  {prescripcionesFiltradas.length.toLocaleString()} muestras
                </span>
              </div>
            </div>

          </div>

          {/* Core KPIs Panel */}
          <KPIPanel 
            totalRx={kpiFarlogranRx}
            averageShare={kpiAverageShare}
            growthRate={kpiGrowthRate}
            topProduct={kpiTopProduct}
          />

          {/* Interactive Charts Section in Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Area Chart: Evolution of Rx volume */}
            <div className="lg:col-span-8">
              <Card className="h-full flex flex-col justify-between">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase font-display">
                    Evolución de Prescripciones Mensuales (Rx)
                  </h3>
                  <p className="text-[11px] text-[#8892b0] font-light mt-0.5">
                    Historial de prescripciones en el territorio e intervalo seleccionado (Pharmabrand S.A. vs. Competidores)
                  </p>
                </div>
                <RxEvolutionChart data={evolutionChartData} />
              </Card>
            </div>

            {/* Right Donut Chart: Market share */}
            <div className="lg:col-span-4">
              <Card className="h-full flex flex-col justify-between">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase font-display">
                    Part. de Mercado ({ultimoPeriodo})
                  </h3>
                  <p className="text-[11px] text-[#8892b0] font-light mt-0.5">
                    Cuota (Share %) por marca en la clase terapéutica
                  </p>
                </div>
                <MarketShareChart data={pieChartData} />
              </Card>
            </div>

            {/* Bottom Bar Chart: Competitor Comparison Size (TAM) */}
            <div className="lg:col-span-12">
              <Card>
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase font-display">
                    Tamaño Anual Móvil (TAM) por Marca
                  </h3>
                  <p className="text-[11px] text-[#8892b0] font-light mt-0.5">
                    Comparativa de TAM Actual (Últimos 12M) vs TAM Anterior por marca para evaluar tendencias de madurez de mercado
                  </p>
                </div>
                <CompetitorComparisonChart data={competitorBarData} />
              </Card>
            </div>

          </div>

          {/* Catalog products catalog table section */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide font-display flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-[#00C9A7]" />
                  <span>Catálogo de Fórmulas Gastroenterológicas</span>
                </h3>
                <p className="text-[11px] text-[#8892b0] font-light">
                  Línea gastro de Pharmabrand S.A. Haga clic en un producto para consultar proyecciones, provincia por provincia.
                </p>
              </div>

              {/* Local Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar fórmula o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#0F1117] border border-[#8892b01a] rounded-xl px-3 py-2 pl-9 text-xs text-white focus:outline-none w-full sm:w-60 focus:border-[#00C9A7]/45"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Catalogue responsive grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#8892b01a] text-gray-400 uppercase tracking-widest text-[9px] font-mono">
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Nombre Comercial</th>
                    <th className="py-3 px-4">Principio Activo (Molécula)</th>
                    <th className="py-3 px-4">Clase ATC</th>
                    <th className="py-3 px-4">Mercado ATC</th>
                    <th className="py-3 px-4">Estatus Línea</th>
                    <th className="py-3 px-4 text-right">Análisis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8892b01a] text-gray-300 font-sans">
                  {productosFiltradosCat.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400 font-light text-xs">
                        No se encontraron productos que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    productosFiltradosCat.map((p) => {
                      const matchingMercado = mercados.find(m => m.codigo === p.clase_atc);
                      return (
                        <tr 
                          key={p.id}
                          onClick={() => onNavigateProduct ? onNavigateProduct(p.id) : router.push(`/productos/${p.id}`)}
                          className="hover:bg-[#8892b00a] transition-colors duration-150 cursor-pointer"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-[#00C9A7]">{p.codigo}</td>
                          <td className="py-3.5 px-4 font-semibold text-white">{p.nombre}</td>
                          <td className="py-3.5 px-4 italic font-light">{p.molecula}</td>
                          <td className="py-3.5 px-4 font-mono text-gray-400">{p.clase_atc}</td>
                          <td className="py-3.5 px-4 text-[#8892b0] font-light max-w-xs truncate">
                            {matchingMercado ? matchingMercado.descripcion : p.codigo_mdo}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={(e) => handleToggleProductStatus(p.id, p.activo, e)}
                              className={`px-2.5 py-1 text-[10px] font-mono font-semibold rounded-full border transition-all cursor-pointer ${
                                p.activo
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/20'
                              }`}
                              title="Haz clic para alternar estatus de comercialización"
                            >
                              {p.activo ? '● ACTIVO' : '○ INACTIVO'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="inline-flex items-center gap-1.5 text-xs text-[#00C9A7] hover:underline font-semibold font-mono">
                              Ver Detalle
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </Card>
        </>
      )}

      {/* Prescription reporting wizard in modal */}
      <Modal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title="Ingresar Muestra de Prescripción Farmacéutica"
      >
        <PrescriptionWizard
          productos={productos}
          mercados={mercados}
          onSave={handleSavePrescription}
          onClose={() => setIsWizardOpen(false)}
        />
      </Modal>

    </div>
  );
}
