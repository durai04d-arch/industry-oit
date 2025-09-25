import React from 'react';
import SensorDashboard from '@/components/SensorDashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <SensorDashboard />
      </div>
    </div>
  );
};

export default Dashboard;