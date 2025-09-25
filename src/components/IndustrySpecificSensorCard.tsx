import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Thermometer, Wind, Droplets, Radio } from 'lucide-react';

interface SensorInsights {
  status: 'normal' | 'warning' | 'critical' | 'optimal' | 'info' | 'safe' | 'clear';
  message: string;
  recommendation: string;
  alertLevel: 'info' | 'warning' | 'error';
}

interface IndustrySpecificSensorCardProps {
  name: string;
  value: number;
  unit: string;
  type: string;
  location?: string;
  industry?: string;
}

const getIntelligentInsights = (name: string, value: number, unit: string, industry?: string) => {
  const insights: SensorInsights = {
    status: 'normal',
    message: '',
    recommendation: '',
    alertLevel: 'info'
  };

  switch (name.toLowerCase()) {
    case 'temperature':
      if (unit === '°C') {
        // Normal range: 20-30°C, with industry-specific adjustments
        if (value < 10 || value > 40) {
          insights.status = 'critical';
          insights.message = value < 10 ? 'CRITICAL: Temperature too low' : 'CRITICAL: Temperature too high';
          insights.recommendation = value < 10 ? 'Check heating systems, risk of equipment damage' : 'Check cooling systems, equipment overheating risk';
          insights.alertLevel = 'error';
        } else if (value < 15 || value > 35) {
          insights.status = 'warning';
          insights.message = value < 15 ? 'Low temperature detected' : 'High temperature detected';
          insights.recommendation = value < 15 ? 'Monitor heating systems' : 'Monitor cooling systems';
          insights.alertLevel = 'warning';
        } else {
          insights.status = 'optimal';
          insights.message = 'Temperature within normal range (15-35°C)';
          insights.recommendation = 'Maintain current conditions';
        }
      }
      break;

    case 'humidity':
      if (unit === '%') {
        // Normal range: 40-70%, alert outside this range
        if (value < 30 || value > 80) {
          insights.status = 'critical';
          insights.message = value < 30 ? 'CRITICAL: Humidity too low' : 'CRITICAL: Humidity too high';
          insights.recommendation = value < 30 ? 'Risk of static electricity, increase humidity' : 'Condensation risk, improve ventilation';
          insights.alertLevel = 'error';
        } else if (value < 40 || value > 70) {
          insights.status = 'warning';
          insights.message = value < 40 ? 'Low humidity detected' : 'High humidity detected';
          insights.recommendation = value < 40 ? 'Monitor humidity levels' : 'Check ventilation systems';
          insights.alertLevel = 'warning';
        } else {
          insights.status = 'optimal';
          insights.message = 'Humidity within optimal range (40-70%)';
          insights.recommendation = 'Maintain current conditions';
        }
      }
      break;

    case 'gas':
    case 'gas level':
      // Normal range: 700-2500, alert outside this range
      if (value < 700 || value > 2500) {
        if (value > 2500) {
          insights.status = 'critical';
          insights.message = 'CRITICAL GAS ALERT - Dangerous levels detected';
          insights.recommendation = 'EVACUATE AREA - Check for gas leaks immediately';
          insights.alertLevel = 'error';
        } else if (value < 700) {
          insights.status = 'warning';
          insights.message = 'Low gas levels detected - potential sensor issue';
          insights.recommendation = 'Check sensor calibration and connections';
          insights.alertLevel = 'warning';
        }
      } else {
        insights.status = 'safe';
        insights.message = 'Gas levels within normal range (700-2500)';
        insights.recommendation = 'Continue regular monitoring';
      }
      break;

    case 'proximity':
    case 'distance':
      if (unit === 'cm') {
        // Normal range: 50-400cm, alert when objects too close
        if (value < 10) {
          insights.status = 'critical';
          insights.message = 'CRITICAL: Object very close - collision risk';
          insights.recommendation = 'IMMEDIATE ACTION - Clear obstruction';
          insights.alertLevel = 'error';
        } else if (value < 30) {
          insights.status = 'warning';
          insights.message = 'Object detected close - safety concern';
          insights.recommendation = 'Monitor area, check for obstructions';
          insights.alertLevel = 'warning';
        } else if (value < 50) {
          insights.status = 'info';
          insights.message = 'Object in proximity range';
          insights.recommendation = 'Normal monitoring';
          insights.alertLevel = 'info';
        } else {
          insights.status = 'clear';
          insights.message = 'Area clear - safe distance maintained';
          insights.recommendation = 'Normal operation';
        }
      }
      break;

    default:
      insights.message = 'Sensor data recorded';
      insights.recommendation = 'Continue monitoring';
  }

  return insights;
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'critical': return 'destructive';
    case 'warning': return 'secondary';
    case 'optimal': 
    case 'safe':
    case 'clear': return 'default';
    default: return 'outline';
  }
};

const getIconComponent = (type: string) => {
  switch (type.toLowerCase()) {
    case 'temperature': return <Thermometer className="h-5 w-5" />;
    case 'gas':
    case 'gas level': return <Wind className="h-5 w-5" />;
    case 'humidity': return <Droplets className="h-5 w-5" />;
    case 'proximity':
    case 'distance': return <Radio className="h-5 w-5" />;
    default: return null;
  }
};

const IndustrySpecificSensorCard: React.FC<IndustrySpecificSensorCardProps> = ({ 
  name, 
  value, 
  unit, 
  type, 
  location,
  industry 
}) => {
  const insights = getIntelligentInsights(name, value, unit, industry);
  const statusVariant = getStatusVariant(insights.status);

  return (
    <Card className={`bg-card border-border transition-all duration-300 hover:shadow-tech ${
      insights.status === 'critical' ? 'ring-2 ring-destructive animate-pulse' : ''
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          {getIconComponent(type)}
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">
            {value.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">
            {unit}
          </div>
        </div>
        
        <Badge
          variant={statusVariant}
          className={`w-full justify-center transition-all duration-300 ${
            insights.status === 'critical' ? 'animate-pulse' : ''
          }`}
        >
          {insights.status.toUpperCase()}
        </Badge>

        <Alert className={`${insights.status === 'critical' ? 'border-destructive' : ''}`}>
          {insights.alertLevel === 'error' && (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertDescription className="text-xs">
            <div className="font-medium mb-1">{insights.message}</div>
            <div className="text-muted-foreground">{insights.recommendation}</div>
          </AlertDescription>
        </Alert>

        {location && (
          <div className="text-xs text-muted-foreground text-center">
            {location}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { IndustrySpecificSensorCard };
export default IndustrySpecificSensorCard;