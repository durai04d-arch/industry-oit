import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Thermometer, Wind, Droplets, Radio } from 'lucide-react';

interface SensorReading {
  id: string;
  sensor_type: string;
  sensor_name: string;
  value: number;
  unit: string;
  location: string;
  created_at: string;
}

interface SensorConfig {
  type: string;
  name: string;
  alertThreshold: number;
  icon: string;
}

interface ProcessedSensorData {
  status: 'normal' | 'warning' | 'critical' | 'offline';
  message: string;
  recommendation: string;
  riskLevel: string;
}

const processSensorData = (config: SensorConfig, reading: SensorReading | null): ProcessedSensorData => {
  if (!reading) {
    return {
      status: 'offline',
      message: 'Sensor offline or no data available',
      recommendation: 'Check sensor connection and power supply',
      riskLevel: 'Unknown'
    };
  }

  const value = reading.value;
  
  switch (config.type) {
    case 'temperature':
      if (value < 0) {
        return {
          status: 'critical',
          message: 'Freezing conditions detected',
          recommendation: 'Activate heating systems immediately. Risk of equipment damage and material freezing.',
          riskLevel: 'CRITICAL - Freezing Risk'
        };
      } else if (value > 50) {
        return {
          status: 'critical',
          message: 'Overheating detected',
          recommendation: 'Activate cooling systems. Risk of fire or equipment damage.',
          riskLevel: 'CRITICAL - Fire Risk'
        };
      } else if (value > 35) {
        return {
          status: 'warning',
          message: 'Temperature elevated',
          recommendation: 'Monitor closely. Consider increasing ventilation.',
          riskLevel: 'MODERATE - Heat Warning'
        };
      } else if (value < 5) {
        return {
          status: 'warning',
          message: 'Low temperature warning',
          recommendation: 'Monitor for freezing conditions. Check heating systems.',
          riskLevel: 'MODERATE - Cold Warning'
        };
      }
      return {
        status: 'normal',
        message: 'Temperature within normal range',
        recommendation: 'Continue normal operations',
        riskLevel: 'LOW - Normal Range'
      };

    case 'methane':
      if (value > 2500) {
        return {
          status: 'critical',
          message: 'EXPLOSIVE GAS LEVELS DETECTED',
          recommendation: 'EVACUATE IMMEDIATELY. Shut off all electrical equipment. Ventilate area.',
          riskLevel: 'CRITICAL - Explosion Risk'
        };
      } else if (value > 1500) {
        return {
          status: 'critical',
          message: 'Dangerous gas concentration',
          recommendation: 'Increase ventilation immediately. Prepare for possible evacuation.',
          riskLevel: 'HIGH - Fire/Explosion Risk'
        };
      } else if (value > 1000) {
        return {
          status: 'warning',
          message: 'Elevated gas levels detected',
          recommendation: 'Increase ventilation. Monitor continuously. Check for gas leaks.',
          riskLevel: 'MODERATE - Gas Warning'
        };
      }
      return {
        status: 'normal',
        message: 'Gas levels within safe limits',
        recommendation: 'Continue normal operations with regular monitoring',
        riskLevel: 'LOW - Safe Range'
      };

    case 'humidity':
      if (value > 90) {
        return {
          status: 'critical',
          message: 'Excessive humidity detected',
          recommendation: 'Risk of condensation, corrosion, and mold. Activate dehumidification systems.',
          riskLevel: 'HIGH - Moisture Damage Risk'
        };
      } else if (value > 80) {
        return {
          status: 'warning',
          message: 'High humidity levels',
          recommendation: 'Monitor for condensation. Consider increasing ventilation.',
          riskLevel: 'MODERATE - Humidity Warning'
        };
      } else if (value < 20) {
        return {
          status: 'warning',
          message: 'Low humidity detected',
          recommendation: 'Risk of static electricity and material damage. Consider humidification.',
          riskLevel: 'MODERATE - Dry Conditions'
        };
      }
      return {
        status: 'normal',
        message: 'Humidity levels optimal',
        recommendation: 'Ideal conditions for storage and operations',
        riskLevel: 'LOW - Optimal Range'
      };

    case 'ultrasonic':
      if (value < 5) {
        return {
          status: 'critical',
          message: 'Object detected very close',
          recommendation: 'COLLISION WARNING. Check for obstacles or unauthorized access.',
          riskLevel: 'HIGH - Collision Risk'
        };
      } else if (value < 10) {
        return {
          status: 'warning',
          message: 'Object approaching',
          recommendation: 'Monitor approach. Prepare safety protocols.',
          riskLevel: 'MODERATE - Proximity Alert'
        };
      } else if (value > 100) {
        return {
          status: 'normal',
          message: 'Clear area detected',
          recommendation: 'Area is clear for normal operations',
          riskLevel: 'LOW - Clear Zone'
        };
      }
      return {
        status: 'normal',
        message: 'Safe distance maintained',
        recommendation: 'Continue monitoring',
        riskLevel: 'LOW - Safe Distance'
      };

    default:
      return {
        status: 'normal',
        message: 'Sensor data received',
        recommendation: 'Monitor regularly',
        riskLevel: 'UNKNOWN'
      };
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'critical': return 'destructive';
    case 'warning': return 'secondary';
    case 'offline': return 'outline';
    default: return 'default';
  }
};

const getIconComponent = (type: string) => {
  switch (type) {
    case 'temperature': return <Thermometer className="h-5 w-5" />;
    case 'methane': return <Wind className="h-5 w-5" />;
    case 'humidity': return <Droplets className="h-5 w-5" />;
    case 'ultrasonic': return <Radio className="h-5 w-5" />;
    default: return null;
  }
};

interface IntelligentSensorCardProps {
  config: SensorConfig;
  reading: SensorReading | null;
  isLoading: boolean;
}

export const IntelligentSensorCard: React.FC<IntelligentSensorCardProps> = ({
  config,
  reading,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            {getIconComponent(config.type)}
            {config.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Skeleton className="h-8 w-20 mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const processedData = processSensorData(config, reading);
  const statusVariant = getStatusVariant(processedData.status);

  return (
    <Card className={`bg-card border-border transition-all duration-300 hover:shadow-tech ${
      processedData.status === 'critical' ? 'ring-2 ring-destructive' : ''
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          {getIconComponent(config.type)}
          {config.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reading ? (
          <>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {reading.value.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                {reading.unit}
              </div>
            </div>
            
            <Badge
              variant={statusVariant}
              className={`w-full justify-center transition-all duration-300 ${
                processedData.status === 'critical' ? 'animate-pulse' : ''
              }`}
            >
              {processedData.riskLevel}
            </Badge>

            <Alert className={`${processedData.status === 'critical' ? 'border-destructive' : ''}`}>
              {processedData.status === 'critical' && (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription className="text-xs">
                <div className="font-medium mb-1">{processedData.message}</div>
                <div className="text-muted-foreground">{processedData.recommendation}</div>
              </AlertDescription>
            </Alert>

            <div className="text-xs text-muted-foreground text-center">
              {reading.location} • {new Date(reading.created_at).toLocaleTimeString()}
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">--</div>
              <div className="text-sm text-muted-foreground">No Data</div>
            </div>
            
            <Badge variant="outline" className="w-full justify-center">
              OFFLINE
            </Badge>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <div className="font-medium mb-1">{processedData.message}</div>
                <div className="text-muted-foreground">{processedData.recommendation}</div>
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IntelligentSensorCard;