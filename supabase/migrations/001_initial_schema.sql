-- Catálogo de productos Pharmabrand S.A. línea gastro
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  molecula TEXT,
  clase_atc TEXT,
  codigo_mdo TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mercados / clases terapéuticas
CREATE TABLE mercados_atc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  producto_farlogran_id UUID REFERENCES productos(id)
);

-- Prescripciones mensuales (propias + competencia)
CREATE TABLE prescripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  periodo TEXT NOT NULL,        -- formato 'YYYY-MM'
  laboratorio TEXT NOT NULL DEFAULT 'PHARMABRAND',    -- 'PHARMABRAND' o nombre competidor
  marca TEXT NOT NULL,
  producto_id UUID REFERENCES productos(id),
  mercado_atc_id UUID REFERENCES mercados_atc(id),
  provincia TEXT,
  rx_total INTEGER DEFAULT 0,
  tam_anterior INTEGER DEFAULT 0,
  tam_actual INTEGER DEFAULT 0,
  pct_crecimiento NUMERIC(6,2),
  pct_share NUMERIC(6,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para queries rápidas
CREATE INDEX idx_px_periodo ON prescripciones(periodo);
CREATE INDEX idx_px_marca ON prescripciones(marca);
CREATE INDEX idx_px_provincia ON prescripciones(provincia);
CREATE INDEX idx_px_laboratorio ON prescripciones(laboratorio);

-- Seed inicial: productos Pharmabrand S.A.
INSERT INTO productos (codigo, nombre, molecula, clase_atc, codigo_mdo) VALUES
('GASTRIL',    'Gastril',      'Sucralfato',                        'A02B9', 'MDO A02B9'),
('BIOFIT',     'Biofit',       'Psyllium',                          'A06A3', 'MDO A06A3'),
('ILUNOX',     'Ilunox',       'PEG 3350',                          'A06A6', 'MDO A06A6'),
('URSOCEL',    'Ursocel',      'Ácido ursodesoxicólico',             'A05A2', 'MDO A05A2'),
('HEPABRAND',  'Hepabrand',    'L-ornitina + L-aspartato',          'A05B',  'MDO A05B'),
('OMECIDOL',   'Omecidol',     'Omeprazol 40mg',                    'A02B2', 'MDO A02B2'),
('OMEFAST',    'Omefast',      'Omeprazol 20mg + bicarbonato',      'A02B2', 'MDO A02B2'),
('SIMATROL',   'Simatrol Q',   'Silimarina + Resveratrol + CoQ10',  'A05B',  'MDO A05B'),
('HELICOPACK', 'Helicopack',   'Claritromicina + Tinidazol + Omep', 'A02B2', 'MDO A02B2'),
('RIFANORM',   'Rifanorm',     'Rifaximina',                        'A07A',  'MDO A07A');
