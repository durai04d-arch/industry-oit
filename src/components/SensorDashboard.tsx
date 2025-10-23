import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { IndustrySpecificSensorCard } from './IndustrySpecificSensorCard';
import { useAuth } from '@/contexts/AuthContext';

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
  { type: 'gas', name: 'GAS LEVEL', alertThreshold: 1000, icon: '💨' },
  { type: 'humidity', name: 'HUMIDITY', alertThreshold: 80, icon: '💧' },
  { type: 'distance', name: 'PROXIMITY', alertThreshold: 10, icon: '📡' },
];


export const SensorDashboard: React.FC = () => {
  const { user } = useAuth();
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sensorConfigs.map((config) => {
          const reading = sensorReadings[config.type];
          return reading ? (
            <IndustrySpecificSensorCard
              key={config.type}
              name={config.name}
              value={parseFloat(reading.value.toString())}
              unit={reading.unit}
              type={reading.sensor_type}
              location={reading.location}
              industry={user?.industry}
            />
          ) : (
            <div key={config.type} className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-2xl text-muted-foreground">--</div>
              <div className="text-sm text-muted-foreground mt-2">{config.name}</div>
              <div className="text-xs text-muted-foreground mt-1">No data available</div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Dashboard updates automatically • Last refresh: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SensorDashboard;