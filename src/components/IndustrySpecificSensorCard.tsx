import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Thermometer, Wind, Droplets, Radio, X, ArrowLeft, Info, AlertCircle, Download, Calendar, TrendingUp, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { jsPDF } from "jspdf";aa
import autoTable from "jspdf-autotable";

// --- Inlined AlertModal Component ---
const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  alertLevel,
  sensorName,
  sensorValue,
  unit,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const sendAlertToEmail = async () => {
    if (!recipientEmail) {
      setSendResult('Please enter an email.');
      return;
    }
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch('/api/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recipientEmail,
          sensorName,
          message,
          value: sensorValue,
          unit,
          alertLevel,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setSendResult('Alert sent successfully.');
      } else {
        setSendResult(json?.error || 'Failed to send alert.');
      }
    } catch (err) {
      setSendResult('Failed to send alert.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const handleBackToDashboard = () => {
    onClose();
    // Navigation logic would be here if react-router-dom was available
    console.log("Navigate to dashboard");
  };

  const getAlertIcon = () => {
    switch (alertLevel) {
      case 'critical':
        return <AlertTriangle className="w-12 h-12 text-destructive animate-pulse-glow" />;
      case 'high':
        return <AlertCircle className="w-12 h-12 text-yellow-500 animate-bounce-in" />;
      case 'medium':
        return <AlertCircle className="w-12 h-12 text-yellow-400 animate-scale-in" />;
      default:
        return <Info className="w-12 h-12 text-blue-500 animate-fade-in" />;
    }
  };

  const getAlertStyles = () => {
    switch (alertLevel) {
      case 'critical':
        return 'bg-gradient-to-br from-destructive/20 to-yellow-500/20 border-destructive/50';
      case 'high':
        return 'bg-gradient-to-br from-yellow-500/20 to-blue-500/20 border-yellow-500/50';
      case 'medium':
        return 'bg-gradient-to-br from-yellow-400/20 to-blue-500/20 border-yellow-400/50';
      default:
        return 'bg-gradient-to-br from-blue-500/20 to-gray-400/20 border-blue-500/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className={cn(
        "relative w-full max-w-md p-8 rounded-2xl border-2 shadow-lg animate-slide-up bg-card",
        getAlertStyles()
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-foreground hover:bg-foreground/10 animate-scale-in"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
        <div className="text-center space-y-6">
          <div className="flex justify-center animate-bounce-in">
            {getAlertIcon()}
          </div>
          <h2 className="text-2xl font-bold text-foreground animate-fade-in">
            {title}
          </h2>
          <div className="bg-card/50 rounded-lg p-4 space-y-2 animate-scale-in">
            <div className="text-sm text-muted-foreground">Sensor</div>
            <div className="text-lg font-semibold text-foreground">{sensorName}</div>
            <div className="text-3xl font-bold text-primary">
              {sensorValue} {unit}
            </div>
          </div>
          <p className="text-foreground/90 leading-relaxed animate-fade-in">
            {message}
          </p>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground block text-left">Send alert to email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border px-3 py-2 bg-input text-foreground"
              />
              <Button disabled={sending} onClick={sendAlertToEmail}>
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </div>
            {sendResult && <div className="text-xs text-muted-foreground mt-1">{sendResult}</div>}
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleBackToDashboard}
              className="flex-1 bg-black text-white hover:bg-gray-800 animate-bounce-in"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-primary to-blue-400 hover:shadow-lg transform hover:scale-105 transition-all duration-300 animate-bounce-in"
              size="lg"
            >
              Acknowledge Alert
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ChatModal (new small chat widget) ---
const ChatModal = ({ isOpen, onClose, sensorName }) => {
  const [messages, setMessages] = useState([{ role: 'system', text: `You are a support assistant for sensor ${sensorName}.` }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensorName, message: input.trim() }),
      });
      const json = await res.json();
      const reply = json?.reply || 'Sorry, no response.';
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Error contacting chat service.' }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card rounded-lg border p-4 z-70">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">Sensor Assistant - {sensorName}</div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        <div className="h-64 overflow-auto mb-2 p-2 bg-background rounded">
          {messages.filter(m => m.role !== 'system').map((m, i) => (
            <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-3 py-1 rounded ${m.role === 'user' ? 'bg-primary/10' : 'bg-green-50'}`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 rounded border px-2 py-1" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }} />
          <Button onClick={sendMessage} disabled={loading}>{loading ? '...' : 'Send'}</Button>
        </div>
      </div>
    </div>
  );
};

// --- Inlined SensorDetailModal Component ---
const SensorDetailModal = ({
  isOpen,
  onClose,
  sensorName,
  sensorType,
  currentValue,
  unit,
  location
}) => {
  const [historicalData, setHistoricalData] = useState([]);
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
    const generateMockData = (startTime, points, sensorUnit) => {
        const data = [];
        const timeStep = (new Date().getTime() - startTime.getTime()) / points;
        for (let i = 0; i < points; i++) {
            const timestamp = new Date(startTime.getTime() + i * timeStep).toISOString();
            let value;
            if (sensorUnit === '°C') { value = 20 + Math.random() * 5 + Math.sin(i / (points / (2 * Math.PI))) * 3; }
            else if (sensorUnit === '%') { value = 55 + Math.random() * 10 - 5; }
            else { value = Math.random() * 100; }
            data.push({ created_at: timestamp, value: parseFloat(value.toFixed(1)), id: `mock-${i}` });
        }
        return data;
    };
    try {
      let startDate = new Date();
      switch (timeRange) {
        case '1h': startDate = new Date(new Date().getTime() - 60 * 60 * 1000); break;
        case '6h': startDate = new Date(new Date().getTime() - 6 * 60 * 60 * 1000); break;
        case '24h': startDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); break;
        case '7d': startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000); break;
        case '30d': startDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000); break;
      }
      setHistoricalData(generateMockData(startDate, 100, unit));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const downloadData = () => {
    if (downloadFormat === 'pdf') downloadPDF();
    else downloadCSV();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${sensorName} Sensor Report`, 20, 30);
    doc.setFontSize(12);
    doc.text(`Sensor Type: ${sensorType}`, 20, 50);
    doc.text(`Current Value: ${currentValue} ${unit}`, 20, 60);
    doc.text(`Location: ${location || 'N/A'}`, 20, 70);
    doc.text(`Time Range: ${timeRange}`, 20, 80);
    const tableData = historicalData.map(item => [new Date(item.created_at).toLocaleString(), `${item.value} ${unit}`]);
    autoTable(doc, { head: [['Timestamp', 'Value']], body: tableData, startY: 100 });
    doc.save(`${sensorName}_report.pdf`);
  };

  const downloadCSV = () => {
    const csvData = [['Timestamp', 'Value', 'Unit'], ...historicalData.map(item => [new Date(item.created_at).toISOString(), item.value.toString(), unit])];
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sensorName}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatChartData = () => historicalData.map(item => ({ time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: item.value, fullTime: new Date(item.created_at).toLocaleString() }));
  const getGaugeColor = () => {
    if (sensorType === 'temperature' && currentValue > 35) return 'hsl(var(--destructive))';
    return 'hsl(var(--primary))';
  };
  const getGaugePercentage = () => Math.min((currentValue / (sensorType === 'temperature' ? 50 : 100)) * 100, 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-4 z-50 bg-background border rounded-lg shadow-lg overflow-hidden animate-scale-in">
        <div className="flex flex-col h-full">
          <div className="p-6 text-black bg-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black/10 rounded-lg"><Settings className="h-8 w-8" /></div>
                <div>
                  <h2 className="text-2xl font-bold">{sensorName} Sensor</h2>
                  <p className="text-black/80">Real-time monitoring and historical analysis</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-black hover:bg-black/10"><X className="h-6 w-6" /></Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Current Reading</CardTitle></CardHeader><CardContent className="text-center"><div className="relative mx-auto w-48 h-48 mb-4"><svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="hsl(var(--border))" strokeWidth="8" fill="none" /><circle cx="50" cy="50" r="40" stroke={getGaugeColor()} strokeWidth="8" fill="none" strokeDasharray={`${getGaugePercentage() * 2.51} 251`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 2s' }} /></svg><div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><div className="text-3xl font-bold text-primary">{currentValue.toFixed(1)}</div><div className="text-sm text-muted-foreground">{unit}</div></div></div></div><Badge>Live Reading</Badge></CardContent></Card>
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Sensor Details</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex justify-between"><span className="text-muted-foreground">Type:</span><span className="font-medium">{sensorType}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Location:</span><span className="font-medium">{location || 'N/A'}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Status:</span><Badge>Active</Badge></div></CardContent></Card>
              </div>
              <div className="lg:col-span-2"><Card className="h-full"><CardHeader><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Historical Data</CardTitle><Select value={timeRange} onValueChange={setTimeRange}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1h">Last Hour</SelectItem><SelectItem value="6h">Last 6 Hours</SelectItem><SelectItem value="24h">Last 24 Hours</SelectItem><SelectItem value="7d">Last 7 Days</SelectItem><SelectItem value="30d">Last 30 Days</SelectItem></SelectContent></Select></div></CardHeader><CardContent>{isLoading ? <div className="h-80 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div> : historicalData.length > 0 ? <ResponsiveContainer width="100%" height={320}><AreaChart data={formatChartData()}><defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" fontSize={12} /><YAxis fontSize={12} /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} labelFormatter={(label, payload) => payload?.[0]?.payload.fullTime || label} /><Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorValue)" /></AreaChart></ResponsiveContainer> : <div className="h-80 flex items-center justify-center text-muted-foreground">No data available</div>}</CardContent></Card></div>
            </div>
            <Card className="mt-6"><CardHeader><CardTitle className="flex items-center gap-2"><Download className="h-5 w-5 text-primary" />Export Data</CardTitle></CardHeader><CardContent><div className="flex items-center gap-4"><Select value={downloadFormat} onValueChange={setDownloadFormat}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="csv">CSV</SelectItem></SelectContent></Select><Button onClick={downloadData} disabled={historicalData.length === 0}><Download className="h-4 w-4 mr-2" />Download {downloadFormat.toUpperCase()}</Button></div></CardContent></Card>
          </div>
        </div>
      </div>
    </div>
  );
};


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

const getIntelligentInsights = (name: string, value: number, unit: string, industry?: string) => {
  const insights: SensorInsights = {
    status: 'normal',
    message: '',
    recommendation: '',
    alertLevel: 'low'
  };

  switch (name.toLowerCase()) {
    case 'temperature':
      if (unit === '°C') {
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
      break;

    case 'humidity':
      if (unit === '%') {
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
      break;

    case 'gas':
    case 'gas level':
      if (value < 700 || value > 2500) {
        if (value > 2500) {
          insights.status = 'critical';
          insights.message = 'CRITICAL GAS ALERT - Dangerous levels detected';
          insights.recommendation = 'EVACUATE AREA - Check for gas leaks immediately';
          insights.alertLevel = 'critical';
        } else if (value < 700) {
          insights.status = 'warning';
          insights.message = 'Low gas levels detected - potential sensor issue';
          insights.recommendation = 'Check sensor calibration and connections';
          insights.alertLevel = 'medium';
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
        if (value < 10) {
          insights.status = 'critical';
          insights.message = 'CRITICAL: Object very close - collision risk';
          insights.recommendation = 'IMMEDIATE ACTION - Clear obstruction';
          insights.alertLevel = 'critical';
        } else if (value < 30) {
          insights.status = 'warning';
          insights.message = 'Object detected close - safety concern';
          insights.recommendation = 'Monitor area, check for obstructions';
          insights.alertLevel = 'high';
        } else if (value < 50) {
          insights.status = 'info';
          insights.message = 'Object in proximity range';
          insights.recommendation = 'Normal monitoring';
          insights.alertLevel = 'medium';
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
  const [showAlert, setShowAlert] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const insights = getIntelligentInsights(name, value, unit, industry);
  const statusVariant = getStatusVariant(insights.status);

  const handleAlertClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
          <div className="ml-auto">
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setOpenChat(true); }}>Chat</Button>
          </div>
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
            <Alert 
              onClick={handleAlertClick}
              className={`border-destructive/30 bg-card/50 cursor-pointer hover:bg-card/70 transition-colors animate-slide-up ${
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

      <ChatModal isOpen={openChat} onClose={() => setOpenChat(false)} sensorName={name} />
    </>
  );
};

export { IndustrySpecificSensorCard };
export default IndustrySpecificSensorCard;
