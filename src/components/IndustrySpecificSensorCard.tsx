import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, BarChart, AlertTriangle, CheckCircle, Info, Flame, Waves, Rss, BatteryCharging, Power } from 'lucide-react';
import { SensorDetailModal } from './SensorDetailModal';

interface SensorInsights {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'gas' | 'distance' | 'rfid' | 'relay' | 'vibration' | 'thermal' | 'voltage';
  latestValue: string;
  unit: string;
  status: 'operational' | 'alert' | 'warning' | 'offline';
  alertLevel?: 'low' | 'medium' | 'high'; // Added for specific alert styling
  description: string;
  location: string;
  lastUpdated: string; // ISO string or similar
  chartData: { name: string; value: number }[];
  icon: React.ElementType;
}

interface IndustrySpecificSensorCardProps {
  insights: SensorInsights;
}

export const IndustrySpecificSensorCard: React.FC<IndustrySpecificSensorCardProps> = ({ insights }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Removed handleCardHover as it's no longer needed for opening the modal on hover
  // const handleCardHover = () => {
  //   // You can add other hover effects here if needed, but not modal opening
  // };

  const handleDetailsClick = () => {
    setIsModalOpen(true);
  };

  const handleAlertClick = () => {
    // This function will still be triggered if onClick is on the card and alertLevel is not 'low'
    // You might want to refine this to a specific alert button if the card itself shouldn't be clickable for alerts
    console.log(`Alert clicked for ${insights.name}`);
    setIsModalOpen(true); // Open modal on alert click as well
  };

  const getStatusBadgeVariant = () => {
    switch (insights.status) {
      case 'alert':
        return 'destructive';
      case 'warning':
        return 'default'; // Yellowish default
      case 'offline':
        return 'secondary'; // Grayish
      case 'operational':
      default:
        return 'success'; // Greenish custom variant
    }
  };

  const getAlertIcon = () => {
    if (insights.alertLevel === 'high') return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (insights.alertLevel === 'medium') return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    return null;
  };

  const getCardBorderColor = () => {
    if (insights.alertLevel === 'high') return 'border-red-500';
    if (insights.alertLevel === 'medium') return 'border-orange-500';
    return 'border-border';
  };

  const renderIcon = () => {
    const IconComponent = insights.icon;
    return <IconComponent className="h-8 w-8 text-primary" />;
  };

  return (
    <>
      <Card
        className={`bg-card transition-all hover:shadow-lg ${getCardBorderColor()} ${
          insights.alertLevel && insights.alertLevel !== 'low' ? 'cursor-pointer' : ''
        }`}
        onClick={insights.alertLevel !== 'low' ? handleAlertClick : undefined} // Only make card clickable for alerts
        // Removed onMouseEnter here
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {renderIcon()}
            <span>{insights.name}</span>
          </CardTitle>
          {getAlertIcon()}
          <Badge variant={getStatusBadgeVariant()}>{insights.status}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">
            {insights.latestValue} {insights.unit}
          </div>
          <p className="text-xs text-muted-foreground">
            {insights.description}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Location: {insights.location}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last Updated: {insights.lastUpdated}
          </p>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleDetailsClick}>
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
      <SensorDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sensorData={insights}
      />
    </>
  );
};

// This mapping should ideally be in a central place or passed as props
export const getSensorIcon = (type: SensorInsights['type']) => {
  switch (type) {
    case 'temperature': return Flame;
    case 'humidity': return Waves;
    case 'gas': return Rss; // Using Rss for gas as a generic 'signal'
    case 'distance': return Info;
    case 'rfid': return CheckCircle; // Using CheckCircle for RFID as it's access control
    case 'relay': return Power;
    case 'vibration': return AlertTriangle; // Using AlertTriangle as vibrations often indicate an issue
    case 'thermal': return LineChart; // Using LineChart as a generic graph/data icon for thermal data
    case 'voltage': return BatteryCharging;
    default: return Info;
  }
};
