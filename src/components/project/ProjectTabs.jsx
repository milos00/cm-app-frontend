import React, { useState } from 'react';
import DashboardTab from './DashboardTab';

const ProjectTabs = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab projectId={projectId} />;
      default:
        return <div className="p-4">Modul nije implementiran.</div>;
    }
  };

  return (
    <div>
      <div className="flex space-x-4 border-b p-4 bg-gray-50">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={activeTab === 'dashboard' ? 'font-bold underline' : ''}
        >
          Dashboard
        </button>
        {/* Ovde kasnije dodajemo druge tabove */}
      </div>
      <div>{renderTab()}</div>
    </div>
  );
};

export default ProjectTabs;