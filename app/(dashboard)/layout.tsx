'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../../components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('visitante@pharmabrand.es');

  useEffect(() => {
    const cachedEmail = localStorage.getItem('fg_user_email');
    if (cachedEmail) {
      setUserEmail(cachedEmail);
    } else {
      // Si no existe sesión, redirigir a login
      router.push('/');
    }
  }, [router]);

  // Determinar la vista activa basándose en la ruta real de Next.js
  let currentView: 'dashboard' | 'producto' = 'dashboard';
  let selectedProductId: string | null = null;

  if (pathname.includes('/productos/')) {
    currentView = 'producto';
    selectedProductId = pathname.split('/').pop() || null;
  }

  const handleNavigate = (view: 'landing' | 'dashboard' | 'producto', productId?: string | null) => {
    if (view === 'landing') {
      localStorage.removeItem('fg_user_email');
      router.push('/');
    } else if (view === 'producto' && productId) {
      router.push(`/productos/${productId}`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex h-screen bg-[#0F1117] text-gray-100 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        selectedProductId={selectedProductId}
        onNavigate={handleNavigate}
        userEmail={userEmail}
      />

      {/* Área Primaria de Contenido Scrollable */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>

    </div>
  );
}
