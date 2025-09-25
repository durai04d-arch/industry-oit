import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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

const sensorConfigs: SensorConfig[] = [
  { type: 'temperature', name: 'TEMPERATURE', alertThreshold: 30.0, icon: '🌡️' },
  { type: 'methane', name: 'METHANE LEVEL', alertThreshold: 1000, icon: '💨' },
  { type: 'vibration', name: 'VIBRATION', alertThreshold: 5.0, icon: '📳' },
  { type: 'pressure', name: 'PRESSURE', alertThreshold: 200, icon: '⚡' },
  { type: 'humidity', name: 'HUMIDITY', alertThreshold: 80, icon: '💧' },
  { type: 'voltage', name: 'VOLTAGE', alertThreshold: 450, icon: '🔌' },
];

const SensorCard: React.FC<{ config: SensorConfig; reading: SensorReading | null; isLoading: boolean }> = ({
  config,
  reading,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            {config.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Skeleton className="h-8 w-20 mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!reading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            {config.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <div className="text-sm text-muted-foreground">No Data</div>
          </div>
          <Badge variant="outline" className="w-full justify-center">
            OFFLINE
          </Badge>
        </CardContent>
      </Card>
    );
  }

  const isAlert = reading.value > config.alertThreshold;
  const statusVariant = isAlert ? 'destructive' : 'default';
  const statusText = isAlert ? 'ALERT' : 'NORMAL';

  return (
    <Card className="bg-card border-border transition-all duration-300 hover:shadow-tech">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          {config.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            isAlert ? 'animate-pulse bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'
          }`}
        >
          {statusText}
        </Badge>
        <div className="text-xs text-muted-foreground text-center">
          {reading.location}
        </div>
      </CardContent>
    </Card>
  );
};

export const SensorDashboard: React.FC = () => {
  const [sensorReadings, setSensorReadings] = useState<{ [key: string]: SensorReading }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestReadings = async () => {
      try {
        // Fetch the latest reading for each sensor type
        const promises = sensorConfigs.map(async (config) => {
          const { data, error } = await supabase
            .from('sensor_readings')
            .select('*')
            .eq('sensor_type', config.type)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching ${config.type} data:`, error);
            return null;
          }

          return data ? { type: config.type, data } : null;
        });

        const results = await Promise.all(promises);
        const readings: { [key: string]: SensorReading } = {};

        results.forEach((result) => {
          if (result) {
            readings[result.type] = result.data;
          }
        });

        setSensorReadings(readings);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching sensor readings:', error);
        setIsLoading(false);
      }
    };

    fetchLatestReadings();

    // Set up real-time subscription
    const channel = supabase
      .channel('sensor-readings-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings',
        },
        (payload) => {
          const newReading = payload.new as SensorReading;
          setSensorReadings((prev) => ({
            ...prev,
            [newReading.sensor_type]: newReading,
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sensor_readings',
        },
        (payload) => {
          const updatedReading = payload.new as SensorReading;
          setSensorReadings((prev) => ({
            ...prev,
            [updatedReading.sensor_type]: updatedReading,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Live Sensor Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time monitoring of industrial sensors and equipment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensorConfigs.map((config) => (
          <SensorCard
            key={config.type}
            config={config}
            reading={sensorReadings[config.type] || null}
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Dashboard updates automatically • Last refresh: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SensorDashboard;