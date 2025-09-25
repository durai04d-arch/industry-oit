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
        if (industry === 'Agriculture') {
          if (value < 5) {
            insights.status = 'critical';
            insights.message = 'Crop damage risk - freezing temperature';
            insights.recommendation = 'Activate frost protection systems, cover sensitive crops';
            insights.alertLevel = 'error';
          } else if (value < 10) {
            insights.status = 'warning';
            insights.message = 'Cold stress on crops possible';
            insights.recommendation = 'Monitor crop health, consider greenhouse heating';
            insights.alertLevel = 'warning';
          } else if (value > 35) {
            insights.status = 'critical';
            insights.message = 'Heat stress on crops - wilting risk';
            insights.recommendation = 'Increase irrigation, provide shade, activate cooling';
            insights.alertLevel = 'error';
          } else if (value > 30) {
            insights.status = 'warning';
            insights.message = 'High temperature - monitor crop stress';
            insights.recommendation = 'Ensure adequate water supply';
            insights.alertLevel = 'warning';
          } else {
            insights.status = 'optimal';
            insights.message = 'Ideal temperature for crop growth';
            insights.recommendation = 'Maintain current conditions';
          }
        } else if (industry === 'Mechanical') {
          if (value < 0) {
            insights.status = 'critical';
            insights.message = 'Machinery freeze risk - lubricants solidifying';
            insights.recommendation = 'Preheat equipment, check hydraulic systems';
            insights.alertLevel = 'error';
          } else if (value > 70) {
            insights.status = 'critical';
            insights.message = 'Machinery overheating - component failure risk';
            insights.recommendation = 'Shutdown equipment, check cooling systems';
            insights.alertLevel = 'error';
          } else if (value > 50) {
            insights.status = 'warning';
            insights.message = 'High operating temperature detected';
            insights.recommendation = 'Check ventilation and coolant levels';
            insights.alertLevel = 'warning';
          } else {
            insights.status = 'optimal';
            insights.message = 'Machinery operating temperature normal';
            insights.recommendation = 'Continue regular maintenance schedule';
          }
        } else if (industry === 'Electronics') {
          if (value < 10) {
            insights.status = 'warning';
            insights.message = 'Low temperature - condensation risk on circuits';
            insights.recommendation = 'Allow gradual warming, check for moisture';
            insights.alertLevel = 'warning';
          } else if (value > 25) {
            insights.status = 'warning';
            insights.message = 'Elevated temperature - component degradation risk';
            insights.recommendation = 'Improve cooling, check thermal management';
            insights.alertLevel = 'warning';
          } else {
            insights.status = 'optimal';
            insights.message = 'Optimal operating temperature for electronics';
            insights.recommendation = 'Maintain stable thermal environment';
          }
        }
      }
      break;

    case 'humidity':
      if (unit === '%') {
        if (industry === 'Agriculture') {
          if (value > 90) {
            insights.status = 'critical';
            insights.message = 'Disease risk - fungal infections likely';
            insights.recommendation = 'Improve ventilation, apply fungicides if needed';
            insights.alertLevel = 'error';
          } else if (value < 40) {
            insights.status = 'warning';
            insights.message = 'Low humidity - plant water stress';
            insights.recommendation = 'Increase irrigation, consider misting systems';
            insights.alertLevel = 'warning';
          } else {
            insights.status = 'optimal';
            insights.message = 'Humidity ideal for plant health';
            insights.recommendation = 'Maintain current moisture levels';
          }
        } else if (industry === 'Electronics') {
          if (value > 60) {
            insights.status = 'critical';
            insights.message = 'Corrosion risk - high humidity damage to circuits';
            insights.recommendation = 'Install dehumidifiers, seal enclosures';
            insights.alertLevel = 'error';
          } else if (value < 20) {
            insights.status = 'warning';
            insights.message = 'Static electricity risk - ESD damage possible';
            insights.recommendation = 'Use anti-static measures, controlled humidification';
            insights.alertLevel = 'warning';
          } else {
            insights.status = 'optimal';
            insights.message = 'Humidity within safe range for electronics';
            insights.recommendation = 'Continue monitoring';
          }
        } else {
          if (value > 80) {
            insights.status = 'warning';
            insights.message = 'High humidity - condensation risk';
            insights.recommendation = 'Improve ventilation or use dehumidifier';
            insights.alertLevel = 'warning';
          } else if (value < 30) {
            insights.status = 'warning';
            insights.message = 'Low humidity - static electricity risk';
            insights.recommendation = 'Consider humidification';
            insights.alertLevel = 'warning';
          } else {
            insights.status = 'optimal';
            insights.message = 'Humidity within optimal range';
            insights.recommendation = 'Maintain current conditions';
          }
        }
      }
      break;

    case 'gas':
    case 'gas level':
      if (industry === 'Agriculture') {
        if (value > 400) {
          insights.status = 'critical';
          insights.message = 'TOXIC GAS ALERT - Methane/Ammonia buildup in storage';
          insights.recommendation = 'EVACUATE - Ventilate area, check grain storage';
          insights.alertLevel = 'error';
        } else if (value > 200) {
          insights.status = 'warning';
          insights.message = 'Gas buildup detected - fermentation/decay possible';
          insights.recommendation = 'Improve ventilation, check stored materials';
          insights.alertLevel = 'warning';
        } else {
          insights.status = 'safe';
          insights.message = 'Air quality safe for agricultural operations';
          insights.recommendation = 'Continue regular monitoring';
        }
      } else if (industry === 'Mechanical') {
        if (value > 500) {
          insights.status = 'critical';
          insights.message = 'EXPLOSION RISK - Flammable gas detected';
          insights.recommendation = 'EMERGENCY SHUTDOWN - Check for fuel leaks';
          insights.alertLevel = 'error';
        } else if (value > 250) {
          insights.status = 'warning';
          insights.message = 'Potential gas leak - investigate immediately';
          insights.recommendation = 'Check fuel lines, improve ventilation';
          insights.alertLevel = 'warning';
        } else {
          insights.status = 'safe';
          insights.message = 'Gas levels safe for mechanical operations';
          insights.recommendation = 'Continue monitoring';
        }
      } else {
        if (value > 500) {
          insights.status = 'critical';
          insights.message = 'FIRE HAZARD - Dangerous gas levels detected';
          insights.recommendation = 'EVACUATE AREA IMMEDIATELY - Check for gas leaks';
          insights.alertLevel = 'error';
        } else if (value > 300) {
          insights.status = 'warning';
          insights.message = 'Elevated gas levels - potential hazard';
          insights.recommendation = 'Investigate source and improve ventilation';
          insights.alertLevel = 'warning';
        } else {
          insights.status = 'safe';
          insights.message = 'Gas levels within safe range';
          insights.recommendation = 'Continue regular monitoring';
        }
      }
      break;

    case 'proximity':
    case 'distance':
      if (unit === 'cm') {
        if (industry === 'Agriculture') {
          if (value < 20) {
            insights.status = 'info';
            insights.message = 'Animal/equipment detected near sensor';
            insights.recommendation = 'Check livestock or machinery position';
            insights.alertLevel = 'info';
          } else {
            insights.status = 'clear';
            insights.message = 'Field area clear';
            insights.recommendation = 'Normal agricultural monitoring';
          }
        } else if (industry === 'Mechanical') {
          if (value < 10) {
            insights.status = 'critical';
            insights.message = 'COLLISION RISK - Object too close to machinery';
            insights.recommendation = 'STOP OPERATION - Clear obstruction immediately';
            insights.alertLevel = 'error';
          } else if (value < 30) {
            insights.status = 'warning';
            insights.message = 'Safety zone breach - object approaching';
            insights.recommendation = 'Reduce speed, prepare for emergency stop';
            insights.alertLevel = 'warning';
          } else {
            insights.status = 'clear';
            insights.message = 'Machinery safety zone clear';
            insights.recommendation = 'Normal operation';
          }
        } else {
          if (value < 10) {
            insights.status = 'warning';
            insights.message = 'Object detected very close';
            insights.recommendation = 'Check for obstruction or unauthorized access';
            insights.alertLevel = 'warning';
          } else if (value < 50) {
            insights.status = 'info';
            insights.message = 'Object detected in proximity';
            insights.recommendation = 'Monitor movement in area';
            insights.alertLevel = 'info';
          } else {
            insights.status = 'clear';
            insights.message = 'Area clear - no objects detected';
            insights.recommendation = 'Normal operation';
          }
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