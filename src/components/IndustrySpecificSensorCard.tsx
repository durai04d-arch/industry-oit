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

  // Helper for AI model integration (placeholder)
  const getAISuggestion = async (payload: {
    name: string;
    value: number;
    unit: string;
    industry?: string;
    location?: string;
  }) => {
    // Example: Call your AI API here and return a suggestion string
    // const response = await fetch('/api/ai-suggest', { method: 'POST', body: JSON.stringify(payload) });
    // const data = await response.json();
    // return data.suggestion;
    return null; // Placeholder
  };

  const insights: SensorInsights = {
    status: 'normal',
    message: '',
    recommendation: '',
    alertLevel: 'low'
  };

  // Example: Use industry and location for tailored logic
  switch (name.toLowerCase()) {
    case 'temperature':
      if (unit === '°C') {
        if (industry === 'Agriculture') {
          // Agriculture-specific thresholds
          if (value < 12 || value > 38) {
            insights.status = 'critical';
            insights.message = value < 12 ? 'CRITICAL: Crop risk due to low temperature' : 'CRITICAL: Crop risk due to high temperature';
            insights.recommendation = value < 12 ? 'Consider greenhouse heating' : 'Irrigate and shade crops';
            insights.alertLevel = 'critical';
          } else if (value < 16 || value > 34) {
            insights.status = 'warning';
            insights.message = value < 16 ? 'Low temperature for optimal crop growth' : 'High temperature for crops';
            insights.recommendation = value < 16 ? 'Monitor crop health' : 'Increase irrigation';
            insights.alertLevel = 'medium';
          } else {
            insights.status = 'optimal';
            insights.message = 'Temperature optimal for agriculture';
            insights.recommendation = 'Maintain current conditions';
          }
          // Location-based info
          if (typeof location === 'string' && location.toLowerCase().includes('field')) {
            insights.recommendation += ' • Field sensors indicate direct crop impact.';
          }
        } else if (industry === 'Mechanical') {
          // Mechanical industry thresholds
          if (value < 10 || value > 40) {
            insights.status = 'critical';
            insights.message = value < 10 ? 'CRITICAL: Equipment risk due to low temperature' : 'CRITICAL: Overheating risk for machinery';
            insights.recommendation = value < 10 ? 'Check heating systems' : 'Check cooling systems';
            insights.alertLevel = 'critical';
          } else if (value < 15 || value > 35) {
            insights.status = 'warning';
            insights.message = value < 15 ? 'Low temperature detected' : 'High temperature detected';
            insights.recommendation = value < 15 ? 'Monitor heating systems' : 'Monitor cooling systems';
            insights.alertLevel = 'medium';
          } else {
            insights.status = 'optimal';
            insights.message = 'Temperature within normal range (15-35°C)';
            insights.recommendation = 'Maintain current conditions';
          }
        } else if (industry === 'Electronics') {
          // Electronics industry thresholds
          if (value < 8 || value > 35) {
            insights.status = 'critical';
            insights.message = value < 8 ? 'CRITICAL: Electronics risk due to low temperature' : 'CRITICAL: Overheating risk for electronics';
            insights.recommendation = value < 8 ? 'Check for condensation risk' : 'Improve cooling and ventilation';
            insights.alertLevel = 'critical';
          } else if (value < 12 || value > 30) {
            insights.status = 'warning';
            insights.message = value < 12 ? 'Low temperature for electronics' : 'High temperature for electronics';
            insights.recommendation = value < 12 ? 'Monitor for condensation' : 'Monitor cooling';
            insights.alertLevel = 'medium';
          } else {
            insights.status = 'optimal';
            insights.message = 'Temperature optimal for electronics';
            insights.recommendation = 'Maintain current conditions';
          }
        } else {
          // Default thresholds
          if (value < 10 || value > 40) {
            insights.status = 'critical';
            insights.message = value < 10 ? 'CRITICAL: Temperature too low' : 'CRITICAL: Temperature too high';
            insights.recommendation = value < 10 ? 'Check heating systems, risk of equipment damage' : 'Check cooling systems, equipment overheating risk';
            insights.alertLevel = 'critical';
          } else if (value < 15 || value > 35) {
            insights.status = 'warning';
            insights.message = value < 15 ? 'Low temperature detected' : 'High temperature detected';
            insights.recommendation = value < 15 ? 'Monitor heating systems' : 'Monitor cooling systems';
            insights.alertLevel = 'medium';
          } else {
            insights.status = 'optimal';
            insights.message = 'Temperature within normal range (15-35°C)';
            insights.recommendation = 'Maintain current conditions';
          }
        }
      }
      break;
    // ...existing code...
    // You can extend similar logic for humidity, gas, proximity, etc. using industry/location
    case 'humidity':
      if (unit === '%') {
        if (industry === 'Agriculture') {
          if (value < 35 || value > 85) {
            insights.status = 'critical';
            insights.message = value < 35 ? 'CRITICAL: Low humidity for crops' : 'CRITICAL: High humidity for crops';
            insights.recommendation = value < 35 ? 'Irrigate crops, risk of wilting' : 'Improve ventilation, risk of fungal growth';
            insights.alertLevel = 'critical';
          } else if (value < 45 || value > 75) {
            insights.status = 'warning';
            insights.message = value < 45 ? 'Low humidity for optimal crop growth' : 'High humidity for crops';
            insights.recommendation = value < 45 ? 'Monitor irrigation' : 'Monitor for fungal issues';
            insights.alertLevel = 'medium';
          } else {
            insights.status = 'optimal';
            insights.message = 'Humidity optimal for agriculture';
            insights.recommendation = 'Maintain current conditions';
          }
        } else {
          // Default logic
          if (value < 30 || value > 80) {
            insights.status = 'critical';
            insights.message = value < 30 ? 'CRITICAL: Humidity too low' : 'CRITICAL: Humidity too high';
            insights.recommendation = value < 30 ? 'Risk of static electricity, increase humidity' : 'Condensation risk, improve ventilation';
            insights.alertLevel = 'critical';
          } else if (value < 40 || value > 70) {
            insights.status = 'warning';
            insights.message = value < 40 ? 'Low humidity detected' : 'High humidity detected';
            insights.recommendation = value < 40 ? 'Monitor humidity levels' : 'Check ventilation systems';
            insights.alertLevel = 'medium';
          } else {
            insights.status = 'optimal';
            insights.message = 'Humidity within optimal range (40-70%)';
            insights.recommendation = 'Maintain current conditions';
          }
        }
      }
      break;
    // ...existing code...
    // Extend for other sensor types as needed
    default:
      insights.message = 'Sensor data recorded';
      insights.recommendation = 'Continue monitoring';
  }

  // Optionally, call AI model for smart suggestion (async, so not used directly here)
  // getAISuggestion({ name, value, unit, industry, location });

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
  const [showAlert, setShowAlert] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const insights = getIntelligentInsights(name, value, unit, industry, location);
  const statusVariant = getStatusVariant(insights.status);

  const handleAlertClick = () => {
    if (insights.alertLevel !== 'low') {
      setShowAlert(true);
    }
  };

  const handleCardHover = () => {
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
        onClick={insights.alertLevel !== 'low' ? handleAlertClick : undefined}
        onMouseEnter={handleCardHover}
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
                <div className="text-muted-foreground truncate">{insights.message}</div>
              </AlertDescription>
            </Alert>
          )}

          {insights.alertLevel === 'low' && (
            <div className="text-xs text-muted-foreground animate-fade-in">
              <div className="font-medium mb-1">{insights.message}</div>
              <div className="text-muted-foreground">{insights.recommendation}</div>
            </div>
          )}

          {location && (
            <div className="text-xs text-muted-foreground text-center animate-fade-in">
              📍 {location}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={`${name} Alert`}
        message={insights.message}
        alertLevel={insights.alertLevel}
        sensorName={name}
        sensorValue={value}
        unit={unit}
      />

      <SensorDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        sensorName={name}
        sensorType={type}
        currentValue={value}
        unit={unit}
        location={location}
      />
    </>
  );
};

export { IndustrySpecificSensorCard };
export default IndustrySpecificSensorCard;