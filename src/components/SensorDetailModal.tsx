import React, { useState, useEffect } from 'react';
import { X, Download, Calendar, TrendingUp, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Note: The 'jspdf' and 'jspdf-autotable' libraries are expected to be loaded globally
// from a CDN via <script> tags in your main index.html file.

interface SensorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensorName: string;
  sensorType: string;
  currentValue: number;
  unit: string;
  location?: string;
}

interface HistoricalData {
  created_at: string;
  value: number;
  id: string;
}

const SensorDetailModal: React.FC<SensorDetailModalProps> = ({
  isOpen,
  onClose,
  sensorName,
  sensorType,
  currentValue,
  unit,
  location
}) => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('pdf');

  useEffect(() => {
    if (isOpen) {
      fetchHistoricalData();
    }
  }, [isOpen, timeRange, sensorType]);

  const fetchHistoricalData = async () => {
    setIsLoading(true);
    // MOCK DATA: Simulating API call since Supabase client isn't available in this environment.
    // In a real application, you would fetch data from your backend or Supabase here.
    const generateMockData = (startTime: Date, points: number, sensorUnit: string) => {
        const data: HistoricalData[] = [];
        const timeStep = (new Date().getTime() - startTime.getTime()) / points;
        for (let i = 0; i < points; i++) {
            const timestamp = new Date(startTime.getTime() + i * timeStep).toISOString();
            let value;
            if (sensorUnit === '°C') { // Temperature
                 value = 20 + Math.random() * 5 + Math.sin(i / (points / (2 * Math.PI))) * 3;
            } else if (sensorUnit === '%') { // Humidity
                 value = 55 + Math.random() * 10 - 5;
            } else { // Other sensors
                 value = Math.random() * 100;
            }
            data.push({
                created_at: timestamp,
                value: parseFloat(value.toFixed(1)),
                id: `mock-${i}`
            });
        }
        return data;
    };
    
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case '1h':
          startDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '6h':
          startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
          break;
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      // Using mock data instead of a database call
      const data = generateMockData(startDate, 100, unit);
      setHistoricalData(data);

    } catch (error) {
      console.error('Error fetching data:', error);
      setHistoricalData([]);
    } finally {
      // Simulate network delay
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const downloadData = () => {
    if (downloadFormat === 'pdf') {
      downloadPDF();
    } else {
      downloadCSV();
    }
  };

  const downloadPDF = () => {
    if (!(window as any).jsPDF) {
        console.error("jsPDF is not loaded. Please include it via a script tag.");
        alert("PDF generation library is not available.");
        return;
    }
    const doc = new (window as any).jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text(`${sensorName} Sensor Report`, 20, 30);
    
    // Sensor details
    doc.setFontSize(12);
    doc.text(`Sensor Type: ${sensorType}`, 20, 50);
    doc.text(`Current Value: ${currentValue} ${unit}`, 20, 60);
    doc.text(`Location: ${location || 'N/A'}`, 20, 70);
    doc.text(`Time Range: ${timeRange}`, 20, 80);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 90);
    
    // Historical data table
    const tableData = historicalData.map(item => [
      new Date(item.created_at).toLocaleString(),
      `${item.value} ${unit}`
    ]);
    
    doc.autoTable({
      head: [['Timestamp', 'Value']],
      body: tableData,
      startY: 100,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 39, 92] }
    });
    
    doc.save(`${sensorName}_sensor_data_${timeRange}.pdf`);
  };

  const downloadCSV = () => {
    const csvData = [
      ['Timestamp', 'Value', 'Unit'],
      ...historicalData.map(item => [
        new Date(item.created_at).toISOString(),
        item.value.toString(),
        unit
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sensorName}_sensor_data_${timeRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatChartData = () => {
    return historicalData.map(item => ({
      time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(item.value.toString()),
      fullTime: new Date(item.created_at).toLocaleString()
    }));
  };

  const getGaugeColor = () => {
    if (sensorType === 'temperature') {
      if (currentValue > 35) return 'hsl(var(--destructive))';
      if (currentValue > 30) return 'hsl(var(--warning-orange))';
      return 'hsl(var(--primary))';
    }
    return 'hsl(var(--primary))';
  };

  const getGaugePercentage = () => {
    if (sensorType === 'temperature') {
      return Math.min((currentValue / 50) * 100, 100);
    }
    if (sensorType === 'humidity') {
      return currentValue;
    }
    return Math.min((currentValue / 100) * 100, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-4 z-50 bg-background border border-primary/20 rounded-lg shadow-navy overflow-hidden animate-scale-in">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-navy p-6 text-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black/10 rounded-lg animate-pulse-glow">
                  <Settings className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold animate-slide-down">{sensorName} Sensor</h2>
                  <p className="text-black/80 animate-fade-in">
                    Real-time monitoring and historical analysis
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-black hover:bg-black/10 animate-scale-in"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Reading & Gauge */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="animate-slide-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary animate-float" />
                      Current Reading
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="relative mx-auto w-48 h-48 mb-4">
                      {/* Animated Gauge */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="hsl(var(--border))"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={getGaugeColor()}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${getGaugePercentage() * 2.51} 251`}
                          strokeLinecap="round"
                          className="animate-shimmer"
                          style={{
                            transition: 'stroke-dasharray 2s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary animate-bounce-in">
                            {currentValue.toFixed(1)}
                          </div>
                          <div className="text-sm text-muted-foreground">{unit}</div>
                        </div>
                      </div>
                    </div>
                    <Badge variant="default" className="animate-fade-in">
                      Live Reading
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary animate-float" />
                      Sensor Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{sensorType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{location || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model:</span>
                      <span className="font-medium">STX-{sensorType.toUpperCase()}-2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="default" className="animate-pulse">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Historical Data Chart */}
              <div className="lg:col-span-2">
                <Card className="h-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary animate-float" />
                        Historical Data
                      </CardTitle>
                      <div className="flex gap-2">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1h">Last Hour</SelectItem>
                            <SelectItem value="6h">Last 6 Hours</SelectItem>
                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-80 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : historicalData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={formatChartData()}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="time" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            domain={['dataMin - 5', 'dataMax + 5']}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                            labelFormatter={(label, payload) => {
                              if (payload && payload[0]) {
                                return payload[0].payload.fullTime;
                              }
                              return label;
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#colorValue)"
                            name={`${sensorName} (${unit})`}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-80 flex items-center justify-center text-muted-foreground">
                        No historical data available for the selected time range
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Download Section */}
            <Card className="mt-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary animate-float" />
                  Export Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="csv">CSV Data</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={downloadData}
                    disabled={historicalData.length === 0}
                    className="animate-bounce-in"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download {downloadFormat.toUpperCase()}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Download sensor data for the selected time range ({timeRange})
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDetailModal;
