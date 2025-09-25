import React, { useState, useEffect } from 'react';
import { X, Download, Calendar, TrendingUp, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

      const { data, error } = await supabase
        .from('sensor_readings')
        .select('created_at, value, id')
        .eq('sensor_type', sensorType)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching historical data:', error);
      } else {
        setHistoricalData(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
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
    const doc = new jsPDF();
    
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
    
    (doc as any).autoTable({
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
      time: new Date(item.created_at).toLocaleTimeString(),
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md animate-fade-in">
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl h-[85vh] bg-white border border-navy-300 rounded-2xl shadow-2xl overflow-hidden animate-entrance-epic"
        onMouseLeave={onClose}
      >
        <div className="flex flex-col h-full text-black">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-600 to-navy-800 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-navy-400/20 to-transparent animate-shimmer-wave"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm animate-float-continuous border border-white/30">
                  <Settings className="h-8 w-8 animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold animate-type-writer bg-gradient-to-r from-white to-navy-100 bg-clip-text text-transparent">
                    {sensorName} Sensor
                  </h2>
                  <p className="text-white/90 animate-slide-up-delayed text-lg">
                    Real-time monitoring and historical analysis
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 animate-bounce-in border border-white/30 backdrop-blur-sm group"
                >
                  <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Reading & Gauge */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="animate-card-rise bg-white border-navy-200 shadow-lg hover:shadow-xl transition-all duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <TrendingUp className="h-5 w-5 text-navy-600 animate-pulse-gentle" />
                      Current Reading
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="relative mx-auto w-48 h-48 mb-4">
                      {/* Animated Gauge */}
                      <svg className="w-full h-full transform -rotate-90 animate-spin-slow-reverse" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                          className="animate-pulse-ring"
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
                          className="animate-gauge-fill"
                          style={{
                            transition: 'stroke-dasharray 3s cubic-bezier(0.4, 0, 0.2, 1)',
                            filter: 'drop-shadow(0 0 8px rgba(34, 39, 92, 0.4))'
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center animate-scale-pulse">
                          <div className="text-4xl font-bold text-black animate-number-count bg-gradient-to-b from-black to-gray-700 bg-clip-text">
                            {currentValue.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">{unit}</div>
                        </div>
                      </div>
                    </div>
                    <Badge variant="default" className="animate-glow-pulse bg-navy-600 text-white border-navy-400">
                      Live Reading
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="animate-card-rise bg-white border-navy-200 shadow-lg hover:shadow-xl transition-all duration-500" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <MapPin className="h-5 w-5 text-navy-600 animate-bounce-gentle" />
                      Sensor Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between animate-slide-in-left">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-black">{sensorType}</span>
                    </div>
                    <div className="flex justify-between animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-black">{location || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium text-black">STX-{sensorType.toUpperCase()}-2024</span>
                    </div>
                    <div className="flex justify-between animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="default" className="animate-status-pulse bg-green-500 text-white">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Historical Data Chart */}
              <div className="lg:col-span-2">
                <Card className="h-full animate-card-rise bg-white border-navy-200 shadow-lg hover:shadow-xl transition-all duration-500" style={{ animationDelay: '0.2s' }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-black">
                        <Calendar className="h-5 w-5 text-navy-600 animate-wiggle" />
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
            <Card className="mt-6 animate-card-rise bg-white border-navy-200 shadow-lg hover:shadow-xl transition-all duration-500" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Download className="h-5 w-5 text-navy-600 animate-bounce-gentle" />
                  Export Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                    <SelectTrigger className="w-32 border-navy-300 text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-navy-300">
                      <SelectItem value="pdf" className="text-black hover:bg-navy-50">PDF Report</SelectItem>
                      <SelectItem value="csv" className="text-black hover:bg-navy-50">CSV Data</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={downloadData}
                    disabled={historicalData.length === 0}
                    className="animate-button-glow bg-navy-600 hover:bg-navy-700 text-white border-navy-400"
                  >
                    <Download className="h-4 w-4 mr-2 animate-bounce-gentle" />
                    Download {downloadFormat.toUpperCase()}
                  </Button>
                  <p className="text-sm text-gray-600">
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