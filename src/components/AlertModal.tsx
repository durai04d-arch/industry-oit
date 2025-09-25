import React from 'react';
import { X, AlertTriangle, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  sensorName: string;
  sensorValue: number;
  unit: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  alertLevel,
  sensorName,
  sensorValue,
  unit,
}) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;
  
  const handleBackToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  const getAlertIcon = () => {
    switch (alertLevel) {
      case 'critical':
        return <AlertTriangle className="w-12 h-12 text-destructive animate-pulse-glow" />;
      case 'high':
        return <AlertCircle className="w-12 h-12 text-navy-warning animate-bounce-in" />;
      case 'medium':
        return <AlertCircle className="w-12 h-12 text-navy-accent animate-scale-in" />;
      default:
        return <Info className="w-12 h-12 text-primary animate-fade-in" />;
    }
  };

  const getAlertStyles = () => {
    switch (alertLevel) {
      case 'critical':
        return 'bg-gradient-to-br from-destructive/20 to-navy-warning/20 border-destructive/50';
      case 'high':
        return 'bg-gradient-to-br from-navy-warning/20 to-primary/20 border-navy-warning/50';
      case 'medium':
        return 'bg-gradient-to-br from-navy-accent/20 to-primary/20 border-navy-accent/50';
      default:
        return 'bg-gradient-to-br from-primary/20 to-navy-light/20 border-primary/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-md p-8 rounded-2xl border-2 shadow-alert animate-slide-up bg-card",
        getAlertStyles()
      )}>
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-foreground hover:bg-foreground/10 animate-scale-in"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Alert Content */}
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center animate-bounce-in">
            {getAlertIcon()}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground animate-fade-in">
            {title}
          </h2>

          {/* Sensor Info */}
          <div className="bg-card/50 rounded-lg p-4 space-y-2 animate-scale-in">
            <div className="text-sm text-muted-foreground">Sensor</div>
            <div className="text-lg font-semibold text-foreground">{sensorName}</div>
            <div className="text-3xl font-bold text-primary">
              {sensorValue} {unit}
            </div>
          </div>

          {/* Message */}
          <p className="text-foreground/90 leading-relaxed animate-fade-in">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleBackToDashboard}
              className="flex-1 animate-bounce-in bg-black text-white hover:bg-zinc-800"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-navy transform hover:scale-105 transition-all duration-300 animate-bounce-in"
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

export default AlertModal;
