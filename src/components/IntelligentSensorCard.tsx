import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Thermometer, Wind, Droplets, Radio } from 'lucide-react';
import AlertModal from '@/components/AlertModal';
import SensorDetailModal from '@/components/SensorDetailModal';

interface SensorInsights {
  status: 'normal' | 'warning' | 'critical' | 'optimal' | 'info' | 'safe' | 'clear';
  message: string;
  recommendation: string;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface IndustrySpecificSensorCardProps {
  name: string;
  value: number;
  unit: string;
  type: string;
  location?: string;
  industry?: string;
}

const getIntelligentInsights = (name: string, value: number, unit: string, industry?: string, location?: string) => {
  // ...existing code...
};

const getStatusVariant = (status: string) => {
  // ...existing code...
};

const getIconComponent = (type: string) => {
  // ...existing code...
};

const IndustrySpecificSensorCard: React.FC<IndustrySpecificSensorCardProps> = ({
  name,
  value,
  unit,
  type,
  location,
  industry
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const insights = getIntelligentInsights(name, value, unit, industry, location);
  const statusVariant = getStatusVariant(insights.status);

  const handleAlertClick = () => {
    if (insights.alertLevel !== 'low') {
      setShowAlert(true);
    }
  };

  const handleCardClick = () => {
    setShowDetailModal(true);
  };

  return (
    <>
      <Card
        className={`bg-card border-border transition-all duration-500 transform hover:scale-105 hover:shadow-navy animate-fade-in cursor-pointer ${
          insights.status === 'critical'
            ? 'ring-2 ring-destructive animate-pulse-glow bg-gradient-to-br from-destructive/10 to-destructive/5'
            : insights.alertLevel === 'high'
            ? 'border-primary/30 hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10'
            : 'hover:bg-gradient-to-br hover:from-primary/5 hover:to-navy-light/5'
        }`}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2 animate-scale-in">
            <div className="text-primary">
              {getIconComponent(type)}
            </div>
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center animate-scale-in">
            <div className="text-3xl font-bold text-primary">
              {value.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              {unit}
            </div>
          </div>
          <Badge
            variant={statusVariant}
            className={`w-full justify-center transition-all duration-300 animate-bounce-in ${
              insights.status === 'critical' ? 'animate-pulse' : ''
            }`}
          >
            {insights.status.toUpperCase()}
          </Badge>
          {insights.alertLevel !== 'low' && (
            <Alert className={`border-destructive/30 bg-card/50 cursor-pointer hover:bg-card/70 transition-colors animate-slide-up ${
              insights.status === 'critical' ? 'border-destructive animate-pulse' : ''
            }`}>
              <AlertTriangle className="h-4 w-4 animate-pulse text-destructive" />
              <AlertDescription className="text-xs">
                <div className="font-medium mb-1">Click for full alert details</div>
                {insights.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {showAlert && (
        <AlertModal
          sensorName={name}
          sensorValue={value}
          unit={unit}
          message={insights.message}
          recommendation={insights.recommendation}
          alertLevel={insights.alertLevel}
          onClose={() => setShowAlert(false)}
          location={location}
        />
      )}
      {showDetailModal && (
        <SensorDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          sensorName={name}
          sensorType={type}
          currentValue={value}
          unit={unit}
          location={location}
        />
      )}
    </>
  );
};

export { IndustrySpecificSensorCard };
export default IndustrySpecificSensorCard;
