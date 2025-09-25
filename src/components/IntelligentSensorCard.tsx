

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Thermometer, Wind, Droplets, Radio, AlertTriangle, Cpu, CheckCircle, Bell } from 'lucide-react';

// --- Mock UI Components (for standalone functionality) ---
const Card = ({ children, className = '' }) => <div className={`border rounded-lg shadow-md bg-gray-800 border-gray-700 text-white ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`p-4 border-b border-gray-700 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h2 className={`text-lg font-bold flex items-center gap-3 ${className}`}>{children}</h2>;
const CardContent = ({ children, className = '' }) => <div className={`p-4 ${className}`}>{children}</div>;
const Badge = ({ children, className = '' }) => <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${className}`}>{children}</span>;
const Skeleton = ({ className = '' }) => <div className={`bg-gray-700 rounded animate-pulse ${className}`}></div>;
const Alert = ({ children, className = '' }) => <div className={`p-3 rounded-md border ${className}`}>{children}</div>;
const AlertDescription = ({ children, className = '' }) => <div className={`text-sm ${className}`}>{children}</div>;

// --- MOCK SUPABASE CLIENT ---
// Simulates fetching data from a Supabase backend.
const mockDatabase = {
  user_profiles: [
    { id: 'user_agri_01', user_name: 'Ravi Kumar', industry: 'Agriculture' },
    { id: 'user_mech_02', user_name: 'Priya Singh', industry: 'Mechanical' },
    { id: 'user_elec_03', user_name: 'Suresh Gupta', industry: 'Electronics' },
  ],
  sensor_readings: {
    'temp-1': { value: 38.5, unit: '°C', location: 'Greenhouse A1', created_at: new Date().toISOString() },
    'gas-1': { value: 2600, unit: 'ppm', location: 'Solvent Storage', created_at: new Date().toISOString() },
    'humidity-1': { value: 25, unit: '%', location: 'Assembly Line 2', created_at: new Date().toISOString() },
    'ultrasonic-1': { value: 4.2, unit: 'cm', location: 'CNC Machine Bay', created_at: new Date().toISOString() },
  },
   // Historical data for trend analysis
  historical_data: {
     'temp-1': [ { value: 36.1 }, { value: 37.2 }, { value: 38.5 } ], // rising trend
     'gas-1': [ { value: 2550 }, { value: 2575 }, { value: 2600 } ], // stable high
     'humidity-1': [ { value: 45 }, { value: 35 }, { value: 25 } ], // falling trend
     'ultrasonic-1': [ { value: 20.1 }, { value: 10.5 }, { value: 4.2 } ], // object approaching
  }
};

const supabase = {
  from: (tableName) => ({
    select: () => ({
      eq: (column, value) => ({
        single: async () => {
          await new Promise(res => setTimeout(res, 300)); // Simulate network latency
          if (tableName === 'user_profiles') {
            const data = mockDatabase.user_profiles.find(p => p[column] === value);
            return { data: data || null, error: data ? null : { message: 'User not found' } };
          }
          return { data: null, error: { message: 'Table not found for single query' } };
        },
        maybeSingle: async () => {
            await new Promise(res => setTimeout(res, 300));
            let data = null;
            // This logic correctly uses 'value' from the parent scope of eq()
            if (tableName === 'sensor_readings') {
                data = mockDatabase.sensor_readings[value] || null;
            } else if (tableName === 'historical_data') {
                data = mockDatabase.historical_data[value] || null;
            }
            return { data, error: null };
        }
      }),
    }),
  }),
};


// --- TYPESCRIPT INTERFACES ---
interface UserProfile {
  id: string;
  user_name: string;
  industry: 'Agriculture' | 'Mechanical' | 'Electronics';
}
interface SensorReading {
  value: number;
  unit: string;
  location: string;
  created_at: string;
}
interface SensorConfig {
  id: string; // Unique ID for this sensor instance
  type: 'temperature' | 'methane' | 'humidity' | 'ultrasonic';
  name: string;
}
interface AiInsight {
  status: 'critical' | 'warning' | 'normal' | 'offline';
  headline: string;
  detailedMessage: string;
  actionableSteps: string[];
  riskLevel: string;
}


// --- AI-POWERED INSIGHTS ENGINE ---
const getAiPoweredInsights = (
    config: SensorConfig,
    reading: SensorReading | null,
    profile: UserProfile,
    historicalData: {value: number}[] | null
): AiInsight => {
    if (!reading) {
        return {
            status: 'offline',
            headline: 'Sensor Offline',
            detailedMessage: `No data received from ${config.name}. The sensor may be disconnected or malfunctioning.`,
            actionableSteps: ['Verify sensor power supply.', 'Check physical connection to the network gateway.', 'Contact maintenance if issue persists.'],
            riskLevel: 'Unknown'
        };
    }

    const { value, location } = reading;
    let trend = 'stable';
    if (historicalData && historicalData.length > 2) {
        const first = historicalData[0].value;
        const last = historicalData[historicalData.length-1].value;
        if (last > first * 1.05) trend = 'rising';
        if (last < first * 0.95) trend = 'falling';
    }

    // --- INDUSTRY: AGRICULTURE ---
    if (profile.industry === 'Agriculture') {
        switch (config.type) {
            case 'temperature':
                if (value > 45) return { status: 'critical', headline: 'Extreme Heat Stress', detailedMessage: `Critical temperature of ${value}°C in ${location}. This can cause permanent crop damage. Trend is ${trend}.`, actionableSteps: ['Activate all available irrigation and misting systems immediately.', 'Increase ventilation in greenhouses.', 'Shade sensitive crops if possible.'], riskLevel: 'CRITICAL' };
                if (value > 38) return { status: 'warning', headline: 'High Temperature', detailedMessage: `Temperature at ${value}°C in ${location}. Risk of reduced photosynthesis and heat stress. Trend is ${trend}.`, actionableSteps: ['Increase irrigation frequency.', 'Ensure ventilation systems are operational.', 'Monitor leaf temperature.'], riskLevel: 'High' };
                return { status: 'normal', headline: 'Optimal Temperature', detailedMessage: `Temperature at ${value}°C is ideal for current crops in ${location}.`, actionableSteps: ['Maintain current climate control settings.'], riskLevel: 'Low' };
            case 'humidity':
                 if (value > 85) return { status: 'warning', headline: 'High Humidity', detailedMessage: `Humidity at ${value}% in ${location} increases risk of fungal diseases (e.g., powdery mildew).`, actionableSteps: ['Increase air circulation.', 'Reduce irrigation frequency.', 'Apply preventative fungicides if necessary.'], riskLevel: 'Moderate' };
                 if (value < 30) return { status: 'warning', headline: 'Low Humidity', detailedMessage: `Humidity at ${value}% in ${location}. Plants may be losing water too quickly (transpiration stress).`, actionableSteps: ['Activate misting systems.', 'Increase irrigation.', 'Check for drafts or leaks in greenhouses.'], riskLevel: 'Moderate' };
                 return { status: 'normal', headline: 'Optimal Humidity', detailedMessage: `Humidity at ${value}% is supporting healthy plant growth.`, actionableSteps: ['Maintain current settings.'], riskLevel: 'Low' };
            case 'ultrasonic': // For Water Tank Levels
                if (value < 10) return { status: 'critical', headline: 'Irrigation Tank Critically Low', detailedMessage: `Water level at ${value}%. Irrigation failure is imminent.`, actionableSteps: ['Refill water tank immediately.', 'Check for leaks in the water supply system.', 'Pause scheduled irrigation to conserve water.'], riskLevel: 'CRITICAL' };
                if (value < 30) return { status: 'warning', headline: 'Water Tank Low', detailedMessage: `Water level at ${value}%. Schedule a refill soon to avoid disruption.`, actionableSteps: ['Schedule water delivery or activate refill pump.', 'Review upcoming irrigation needs.'], riskLevel: 'Moderate' };
                return { status: 'normal', headline: 'Water Level Sufficient', detailedMessage: `Water tank is at ${value}%, sufficient for scheduled operations.`, actionableSteps: ['No action needed.'], riskLevel: 'Low' };

        }
    }
    
    // --- INDUSTRY: ELECTRONICS ---
    if (profile.industry === 'Electronics') {
        switch (config.type) {
            case 'humidity':
                if (value < 30) return { status: 'critical', headline: 'CRITICAL: Static Risk (ESD)', detailedMessage: `Humidity is critically low at ${value}% in ${location}. High risk of Electrostatic Discharge, which can destroy sensitive components.`, actionableSteps: ['Activate all humidification systems IMMEDIATELY.', 'Ensure all personnel are using ESD grounding straps.', 'Halt movement of sensitive components until humidity is > 40%.'], riskLevel: 'CRITICAL' };
                if (value > 70) return { status: 'warning', headline: 'Corrosion Risk', detailedMessage: `High humidity (${value}%) in ${location} creates a risk of moisture ingress and PCB corrosion.`, actionableSteps: ['Activate dehumidifiers.', 'Check seals on component storage.', 'Inspect sensitive boards for moisture.'], riskLevel: 'High' };
                return { status: 'normal', headline: 'ESD Safe Humidity', detailedMessage: `Humidity at ${value}% is within the safe range for electronics assembly.`, actionableSteps: ['Maintain current settings.'], riskLevel: 'Low' };
            case 'temperature':
                 if (value > 30) return { status: 'warning', headline: 'Component Overheating Risk', detailedMessage: `Temperature at ${value}°C in ${location} can reduce component lifespan and affect solder reflow profiles.`, actionableSteps: ['Verify HVAC system operation.', 'Check for blocked air vents near machinery.', 'Monitor temperature of sensitive equipment.'], riskLevel: 'Moderate' };
                 return { status: 'normal', headline: 'Optimal Temperature', detailedMessage: `Temperature at ${value}°C is ideal for the cleanroom environment.`, actionableSteps: ['No action needed.'], riskLevel: 'Low' };
            case 'methane': // For Solvents/VOCs
                if (value > 1000) return { status: 'critical', headline: 'High VOC Concentration', detailedMessage: `High concentration of volatile organic compounds (${value} ppm) detected. This is a health hazard for staff.`, actionableSteps: ['Activate emergency ventilation.', 'Ensure all personnel are wearing appropriate PPE.', 'Investigate for solvent spills or leaks.'], riskLevel: 'CRITICAL' };
                return { status: 'normal', headline: 'VOC Levels Safe', detailedMessage: 'Air quality is within safe operational limits.', actionableSteps: ['No action needed.'], riskLevel: 'Low' };
        }
    }
    
    // Fallback for other industries or unhandled sensors
    return {
        status: 'normal',
        headline: 'Sensor Reading Normal',
        detailedMessage: `Sensor ${config.name} reports a value of ${value} ${reading.unit} at ${location}.`,
        actionableSteps: ['Continue with standard operating procedures.'],
        riskLevel: 'Low'
    };
};


// --- UI HELPER FUNCTIONS ---
const getStatusStyles = (status: AiInsight['status']) => {
  switch (status) {
    case 'critical': return { variant: 'destructive', ring: 'ring-2 ring-red-500 animate-pulse', icon: <AlertTriangle className="h-5 w-5 text-red-500" /> };
    case 'warning': return { variant: 'secondary', ring: 'ring-2 ring-yellow-500', icon: <Bell className="h-5 w-5 text-yellow-500" /> };
    case 'offline': return { variant: 'outline', ring: 'border-dashed border-gray-500', icon: <Zap className="h-5 w-5 text-gray-500" /> };
    default: return { variant: 'default', ring: '', icon: <CheckCircle className="h-5 w-5 text-green-500" /> };
  }
};

const getIconComponent = (type: SensorConfig['type']) => {
  const commonClass = "h-6 w-6 text-blue-400";
  switch (type) {
    case 'temperature': return <Thermometer className={commonClass} />;
    case 'methane': return <Wind className={commonClass} />;
    case 'humidity': return <Droplets className={commonClass} />;
    case 'ultrasonic': return <Radio className={commonClass} />;
    default: return null;
  }
};


// --- MAIN SENSOR CARD COMPONENT ---
export const AiPoweredSensorCard: React.FC<{ config: SensorConfig; userId: string; }> = ({ config, userId }) => {
  const [reading, setReading] = useState<SensorReading | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Fetch user profile and sensor reading in parallel
      const profilePromise = supabase.from('user_profiles').select().eq('id', userId).single();
      const readingPromise = supabase.from('sensor_readings').select().eq('id', config.id).maybeSingle();
      const historyPromise = supabase.from('historical_data').select().eq('id', config.id).maybeSingle();

      const [{ data: profileData }, { data: readingData }, {data: historyData}] = await Promise.all([profilePromise, readingPromise, historyPromise]);
      
      setProfile(profileData);
      setReading(readingData);
      setHistoricalData(historyData);
      setIsLoading(false);
    };
    fetchData();
  }, [config.id, userId]);

  if (isLoading || !profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center"><Skeleton className="h-8 w-24 mx-auto mb-1" /><Skeleton className="h-4 w-16 mx-auto" /></div>
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const insight = getAiPoweredInsights(config, reading, profile, historicalData);
  const styles = getStatusStyles(insight.status);

  return (
    <Card className={styles.ring}>
      <CardHeader>
        <CardTitle>
          {getIconComponent(config.type)}
          <span>{config.name}</span>
          <Badge className="bg-gray-600 text-gray-200 ml-auto">{reading?.location || 'N/A'}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
            <div className="text-4xl font-bold text-white">{reading ? reading.value.toFixed(1) : '--'}</div>
            <div className="text-sm text-gray-400">{reading?.unit || 'No Data'}</div>
        </div>
        
        <Badge className={`w-full justify-center text-center ${
            insight.status === 'critical' ? 'bg-red-600 text-white' : 
            insight.status === 'warning' ? 'bg-yellow-500 text-black' : 
            'bg-green-600 text-white'
        }`}>
            {insight.riskLevel}
        </Badge>
        
        <Alert className={`${
            insight.status === 'critical' ? 'border-red-500 bg-red-900/20' : 
            insight.status === 'warning' ? 'border-yellow-500 bg-yellow-900/20' : 
            'border-gray-700'
        }`}>
            <div className="flex items-start gap-3">
                <div className="pt-1">{styles.icon}</div>
                <AlertDescription>
                    <div className="font-bold mb-1">{insight.headline}</div>
                    <div className="text-gray-300 mb-2">{insight.detailedMessage}</div>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                        {insight.actionableSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                </AlertDescription>
            </div>
        </Alert>
        
        <div className="text-xs text-gray-500 text-center pt-2">
          Last updated: {reading ? new Date(reading.created_at).toLocaleTimeString() : 'N/A'}
        </div>
      </CardContent>
    </Card>
  );
};


// --- MAIN APP WRAPPER TO DISPLAY THE DASHBOARD ---
const SmartSensorDashboard = () => {
    // Define the sensors and the user for this dashboard view
    const userId = 'user_agri_01'; // Try changing to 'user_elec_03' or 'user_mech_02'
    
    const sensorConfigs: SensorConfig[] = [
        { id: 'temp-1', type: 'temperature', name: 'Greenhouse Temperature' },
        { id: 'humidity-1', type: 'humidity', name: 'Assembly Line Humidity' },
        { id: 'gas-1', type: 'methane', name: 'Solvent Storage VOC' },
        { id: 'ultrasonic-1', type: 'ultrasonic', name: 'CNC Machine Proximity' },
    ];

    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            const {data} = await supabase.from('user_profiles').select().eq('id', userId).single();
            setCurrentUser(data);
        }
        fetchUser();
    }, [userId]);


    return (
        <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Cpu className="text-blue-400"/>
                        AI-Powered IIoT Dashboard
                    </h1>
                    {currentUser && <p className="text-gray-400 mt-1">Displaying sensor data for <span className="font-bold text-white">{currentUser.user_name}</span> in the <span className="font-bold text-white">{currentUser.industry}</span> sector.</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {sensorConfigs.map(config => (
                        <AiPoweredSensorCard key={config.id} config={config} userId={userId} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SmartSensorDashboard;

