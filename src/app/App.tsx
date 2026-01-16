import { useState } from 'react';
import { DMSSidebar } from './components/dms-sidebar';
import { DMSTopbar } from './components/dms-topbar';
import { Dashboard } from './components/dashboard';
import { WarrantyWorkflow } from './components/warranty-workflow';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'warranty':
        return <WarrantyWorkflow />;
      case 'inventory':
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto text-center py-20">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h2 className="text-2xl mb-2">Inventory Management</h2>
              <p className="text-muted-foreground">
                Vehicle inventory management module coming soon
              </p>
            </div>
          </div>
        );
      case 'leads':
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto text-center py-20">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h2 className="text-2xl mb-2">Lead Management</h2>
              <p className="text-muted-foreground">
                Customer lead tracking and management module coming soon
              </p>
            </div>
          </div>
        );
      case 'sales':
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto text-center py-20">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-2xl mb-2">Sales Management</h2>
              <p className="text-muted-foreground">
                Sales tracking and reporting module coming soon
              </p>
            </div>
          </div>
        );
      case 'service':
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto text-center py-20">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h2 className="text-2xl mb-2">Service Management</h2>
              <p className="text-muted-foreground">
                Vehicle service and maintenance tracking module coming soon
              </p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto text-center py-20">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h2 className="text-2xl mb-2">Reports & Analytics</h2>
              <p className="text-muted-foreground">
                Comprehensive reporting and analytics module coming soon
              </p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto text-center py-20">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h2 className="text-2xl mb-2">System Settings</h2>
              <p className="text-muted-foreground">
                System configuration and settings module coming soon
              </p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <DMSSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <DMSTopbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {activeSection === 'warranty' ? (
            renderContent()
          ) : (
            <div className="p-6">
              {renderContent()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}