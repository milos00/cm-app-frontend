import React, { useState } from 'react';
import DashboardTab from './DashboardTab';
import ConstructionPackagesTab from './ConstructionPackagesTab';

const ProjectTabs = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab projectId={projectId} />;
      case 'packages':
        return <ConstructionPackagesTab projectId={projectId} />;
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
        <button
          onClick={() => setActiveTab('packages')}
          className={activeTab === 'packages' ? 'font-bold underline' : ''}
        >
          Construction Packages
        </button>
      </div>
      <div>{renderTab()}</div>
    </div>
  );
};

export default ProjectTabs;