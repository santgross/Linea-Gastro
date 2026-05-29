import React from 'react';
import '../src/index.css';

export const metadata = {
  title: 'Línea Gastro — Pharmabrand S.A.',
  description: 'Sistema de análisis de prescripciones y mercados para la línea gastroenterología de Pharmabrand S.A.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#0F1117] text-gray-100 min-h-screen font-sans selection:bg-[#00C9A7] selection:text-[#0F1117]">
        {children}
      </body>
    </html>
  );
}
