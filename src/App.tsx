import React, { useState, useEffect } from 'react';
import LandingPage from '../app/page';
import DashboardPage from '../app/(dashboard)/dashboard/page';
import ProductDetailPage from '../app/(dashboard)/productos/[id]/page';
import Sidebar from '../components/dashboard/Sidebar';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'producto'>('landing');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('visitante@pharmabrand.es');

  // Recuperar sesión rápida de local / hash si ya existe para evitar re-iniciar sesión al recargar
  useEffect(() => {
    const hash = window.location.hash;
    const cachedEmail = localStorage.getItem('fg_user_email');
    
    if (cachedEmail) {
      setUserEmail(cachedEmail);
      if (hash.startsWith('#/productos/')) {
        const id = hash.replace('#/productos/', '');
        setCurrentView('producto');
        setSelectedProductId(id);
      } else if (hash === '#/dashboard') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('dashboard');
      }
    } else {
      setCurrentView('landing');
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash;
      const cached = localStorage.getItem('fg_user_email');
      if (!cached) {
        setCurrentView('landing');
        return;
      }
      
      if (currentHash === '#/dashboard' || currentHash === '') {
        setCurrentView('dashboard');
        setSelectedProductId(null);
      } else if (currentHash.startsWith('#/productos/')) {
        const id = currentHash.replace('#/productos/', '');
        setCurrentView('producto');
        setSelectedProductId(id);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem('fg_user_email', email);
    setUserEmail(email);
    setCurrentView('dashboard');
    window.location.hash = '#/dashboard';
  };

  const handleNavigate = (view: 'landing' | 'dashboard' | 'producto', productId?: string | null) => {
    if (view === 'landing') {
      localStorage.removeItem('fg_user_email');
      window.location.hash = '';
      setCurrentView('landing');
      setSelectedProductId(null);
      return;
    }

    if (view === 'producto' && productId) {
      setSelectedProductId(productId);
      setCurrentView('producto');
      window.location.hash = `#/productos/${productId}`;
    } else {
      setSelectedProductId(null);
      setCurrentView('dashboard');
      window.location.hash = '#/dashboard';
    }
  };

  // Renderizar la vista principal según el estado
  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardPage 
            onNavigateProduct={(id) => handleNavigate('producto', id)} 
            userEmail={userEmail}
          />
        );
      case 'producto':
        return selectedProductId ? (
          <ProductDetailPage 
            productId={selectedProductId} 
            onBack={() => handleNavigate('dashboard')} 
          />
        ) : (
          <div className="p-8 text-center text-gray-400">Seleccione un producto para ver el análisis detallado.</div>
        );
      case 'landing':
      default:
        return <LandingPage onLoginSuccess={handleLoginSuccess} />;
    }
  };

  // Si estamos en la página de inicio, no mostramos el layout del panel lateral
  if (currentView === 'landing') {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-[#0F1117] text-gray-100 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        selectedProductId={selectedProductId}
        onNavigate={handleNavigate}
        userEmail={userEmail}
      />

      {/* Primary Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {renderMainContent()}
        </div>
      </main>

    </div>
  );
}
