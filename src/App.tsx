import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { MobileNavigation } from './components/common/MobileNavigation';
import { ToastContainer } from './components/common/Toast';
import { Footer } from './components/common/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { AddActivityPage } from './pages/AddActivityPage';
import { ProgressPage } from './pages/ProgressPage';
import { HistoryPage } from './pages/HistoryPage';
import { GoalsPage } from './pages/GoalsPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, toasts, removeToast } = useFitness();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'add':
        return <AddActivityPage />;
      case 'progress':
        return <ProgressPage />;
      case 'history':
        return <HistoryPage />;
      case 'goals':
        return <GoalsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>

        <Footer />
      </div>

      {/* Mobile Bottom Navigation (< 1024px) */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

const MainRouter: React.FC = () => {
  const { isAuthenticated, authView } = useAuth();

  if (!isAuthenticated) {
    return authView === 'signup' ? <SignUpPage /> : <LoginPage />;
  }

  return (
    <FitnessProvider>
      <AppContent />
    </FitnessProvider>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}

export default App;
