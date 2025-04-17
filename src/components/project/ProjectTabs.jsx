import React, { useState } from 'react';
import DashboardTab from './DashboardTab';
import ConstructionPackagesTab from './ConstructionPackagesTab';
import ContractorTab from './ContractorTab';
import ScheduleTab from './ScheduleTab';
import DailyLogsTab from './DailyLogsTab';
import { getActivities } from '../../services/api'; // dodato

const ProjectTabs = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activities, setActivities] = useState([]); // ako želiš da ih koristiš globalno

const fetchActivities = async () => {
  const data = await getActivities(projectId);
  setActivities(data); // možeš sačuvati lokalno ili ignorisati
};

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab projectId={projectId} />;
      case 'packages':
        return <ConstructionPackagesTab projectId={projectId} />;
      case 'contractors':
        return <ContractorTab projectId={projectId} />;
      case 'schedule':
        return <ScheduleTab projectId={projectId} fetchActivities={fetchActivities} />;
      case 'dailyLogs':
        return <DailyLogsTab projectId={projectId} refreshActivities={fetchActivities} />;
      default:
        return null;
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
        <button
          onClick={() => setActiveTab('contractors')}
          className={activeTab === 'contractors' ? 'font-bold underline' : ''}
        >
          Contractors
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={activeTab === 'schedule' ? 'font-bold underline' : ''}
        >
          Schedule
        </button>
        <button
          onClick={() => setActiveTab('dailyLogs')}
          className={activeTab === 'dailyLogs' ? 'font-bold underline' : ''}
        >
          Daily Logs
        </button>
      </div>

      <div className="p-4">{renderTab()}</div>
    </div>
  );
};

export default ProjectTabs;