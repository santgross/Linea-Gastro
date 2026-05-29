import React, { useState } from 'react';
import { Producto, MercadoATC, Prescripcion } from '../../lib/types';
import Button from '../ui/Button';

interface PrescriptionWizardProps {
  productos: Producto[];
  mercados: MercadoATC[];
  onSave: (prescription: Omit<Prescripcion, 'id' | 'created_at'>) => Promise<void>;
  onClose: () => void;
}

export default function PrescriptionWizard({ productos, mercados, onSave, onClose }: PrescriptionWizardProps) {
  const [periodo, setPeriodo] = useState('2026-05');
  const [laboratorio, setLaboratorio] = useState('PHARMABRAND');
  const [marca, setMarca] = useState('');
  const [productoId, setProductoId] = useState('');
  const [mercadoAtcId, setMercadoAtcId] = useState('');
  const [provincia, setProvincia] = useState('Madrid');
  const [rxTotal, setRxTotal] = useState(150);
  const [tamAnterior, setTamAnterior] = useState(1200);
  const [tamActual, setTamActual] = useState(1350);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleProductoChange = (id: string) => {
    setProductoId(id);
    const selectedProd = productos.find(p => p.id === id);
    if (selectedProd) {
      if (laboratorio === 'PHARMABRAND') {
        setMarca(selectedProd.nombre);
      }
      const matchingMercado = mercados.find(m => m.codigo === selectedProd.clase_atc);
      if (matchingMercado) {
        setMercadoAtcId(matchingMercado.id);
      }
    }
  };

  const handleLaboratorioChange = (lab: string) => {
    setLaboratorio(lab);
    if (lab === 'PHARMABRAND' && productoId) {
      const selectedProd = productos.find(p => p.id === productoId);
      if (selectedProd) setMarca(selectedProd.nombre);
    } else if (lab !== 'PHARMABRAND') {
      setMarca('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodo || !laboratorio || !marca || !provincia) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    setSubmitting(true);
    setError('');

    // Calcular crecimiento y share estimados
    const pct_crecimiento = tamAnterior > 0 
      ? Number(((tamActual - tamAnterior) / tamAnterior * 100).toFixed(2)) 
      : 0;
    
    // El share se ajustará dinámicamente en el dashboard global, estimamos uno base
    const pct_share = tamActual > 0 
      ? Number(((rxTotal / tamActual) * 100).toFixed(2)) 
      : 0;

    try {
      await onSave({
        periodo,
        laboratorio,
        marca,
        producto_id: productoId || null,
        mercado_atc_id: mercadoAtcId || null,
        provincia,
        rx_total: Number(rxTotal),
        tam_anterior: Number(tamAnterior),
        tam_actual: Number(tamActual),
        pct_crecimiento,
        pct_share
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el reporte clínico');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-200">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs font-mono">
          {error}
        </div>
      )}

      {/* Periodo y Provincia */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Período Mensual *</label>
          <input
            type="month"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="w-full bg-[#0F1117] border border-[#8892b022] rounded-lg p-2.5 text-white active:border-[#00C9A7] focus:outline-none focus:border-[#00C9A7]/50"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Provincia/Región *</label>
          <select
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            className="w-full bg-[#0F1117] border border-[#8892b022] rounded-lg p-2.5 text-white active:border-[#00C9A7] focus:outline-none focus:border-[#00C9A7]/50"
            required
          >
            <option value="Madrid">Madrid</option>
            <option value="Barcelona">Barcelona</option>
            <option value="Andalucía">Andalucía</option>
            <option value="Euskadi">Euskadi</option>
            <option value="Galicia">Galicia</option>
            <option value="Valencia">Valencia</option>
          </select>
        </div>
      </div>

      {/* Laboratorio y Marca */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Laboratorio Editorial *</label>
          <select
            value={laboratorio}
            onChange={(e) => handleLaboratorioChange(e.target.value)}
            className="w-full bg-[#0F1117] border border-[#8892b022] rounded-lg p-2.5 text-white active:border-[#00C9A7] focus:outline-none focus:border-[#00C9A7]/50"
            required
          >
            <option value="PHARMABRAND">PHARMABRAND (Propio)</option>
            <option value="ALMIRALL">ALMIRALL</option>
            <option value="ROVI">ROVI</option>
            <option value="FAES">FAES</option>
            <option value="ASTRAZENECA">ASTRAZENECA</option>
            <option value="SANDOZ">SANDOZ</option>
            <option value="ALFASIGMA">ALFASIGMA</option>
            <option value="P&G">P&G</option>
            <option value="ESTEVE">ESTEVE</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Nombre Comercial (Marca) *</label>
          <input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder={laboratorio === 'PHARMABRAND' ? 'Seleccione producto para autocompletar' : 'p. ej. Losec'}
            className="w-full bg-[#0F1117] border border-[#8892b022] rounded-lg p-2.5 text-white active:border-[#00C9A7] focus:outline-none focus:border-[#00C9A7]/50"
            disabled={laboratorio === 'PHARMABRAND' && !productoId}
            required
          />
        </div>
      </div>

      {/* Asociación del Catálogo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Mapear con Pharmabrand G.</label>
          <select
            value={productoId}
            onChange={(e) => handleProductoChange(e.target.value)}
            className="w-full bg-[#0F1117] border border-[#8892b022] rounded-lg p-2.5 text-white active:border-[#00C9A7] focus:outline-none focus:border-[#00C9A7]/50"
          >
            <option value="">-- Competidor/Sin mapear --</option>
            {productos.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.nombre} ({prod.molecula})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Clase ATC / Mercado</label>
          <select
            value={mercadoAtcId}
            onChange={(e) => setMercadoAtcId(e.target.value)}
            className="w-full bg-[#0F1117] border border-[#8892b022] rounded-lg p-2.5 text-white active:border-[#00C9A7] focus:outline-none focus:border-[#00C9A7]/50"
          >
            <option value="">-- Autodetectar --</option>
            {mercados.map((m) => (
              <option key={m.id} value={m.id}>
                {m.codigo} - {m.descripcion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Valores Clínicos Numéricos */}
      <div className="grid grid-cols-3 gap-3 border-t border-[#8892b01a] pt-4">
        <div>
          <label className="block text-[10px] font-medium text-gray-400 uppercase mb-1">Rx Mensual</label>
          <input
            type="number"
            min={0}
            value={rxTotal}
            onChange={(e) => setRxTotal(Number(e.target.value))}
            className="w-full bg-[#0F1117] border border-[#8892b022] rounded-lg p-2.5 text-white active:border-[#00C9A7] focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-400 uppercase mb-1">TAM Anterior</label>
          <input
            type="number"
            min={1}
            value={tamAnterior}
            onChange={(e) => setTamAnterior(Number(e.target.value))}
            className="w-full bg-[#0F1117] border border-[#8892b022] rounded-lg p-2.5 text-white active:border-[#00C9A7] focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-400 uppercase mb-1">TAM Actual</label>
          <input
            type="number"
            min={1}
            value={tamActual}
            onChange={(e) => setTamActual(Number(e.target.value))}
            className="w-full bg-[#0F1117] border border-[#8892b022] rounded-lg p-2.5 text-white active:border-[#00C9A7] focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#8892b01a]">
        <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="px-6" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Registrar Prescripción'}
        </Button>
      </div>

    </form>
  );
}
