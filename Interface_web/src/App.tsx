import { useState } from 'react';
import Shell from './components/Shell';
import type { NavPage } from './data/modules';

import Dashboard from './pages/Dashboard';
import SuiteHome from './pages/SuiteHome';
import Especificacion from './pages/Especificacion';
import ABT from './pages/ABT';
import INV from './pages/INV';
import PRD from './pages/PRD';
import CAL from './pages/CAL';
import MNT from './pages/MNT';
import PLM from './pages/PLM';
import CAP from './pages/CAP';
import PLA from './pages/PLA';
import MES from './pages/MES';
import TRA from './pages/TRA';
import REN from './pages/REN';
import EXC from './pages/EXC';
import IOT from './pages/IOT';
import COS from './pages/COS';
import TRV from './pages/TRV';

export default function App() {
  const [page, setPage] = useState<NavPage>('dashboard');

  function navigate(p: NavPage) {
    setPage(p);
  }

  function renderPage() {
    switch (page) {
      case 'suite':
        return <SuiteHome onNavigate={navigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'espec':
        return <Especificacion onNavigate={navigate} />;
      case 'abt':
        return <ABT />;
      case 'inv':
        return <INV />;
      case 'prd':
        return <PRD />;
      case 'cal':
        return <CAL />;
      case 'mnt':
        return <MNT />;
      case 'plm':
        return <PLM />;
      case 'cap':
        return <CAP />;
      case 'pla':
        return <PLA />;
      case 'mes':
        return <MES />;
      case 'tra':
        return <TRA />;
      case 'ren':
        return <REN />;
      case 'exc':
        return <EXC />;
      case 'iot':
        return <IOT />;
      case 'cos':
        return <COS />;
      case 'trv':
        return <TRV />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  }

  return (
    <Shell currentPage={page} onNavigate={navigate}>
      {renderPage()}
    </Shell>
  );
}
