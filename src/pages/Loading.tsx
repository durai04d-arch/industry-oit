import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Zap, Database, Shield } from 'lucide-react';

const Loading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const steps = [
    { label: 'Verifying credentials...', icon: Shield },
    { label: 'Connecting to database...', icon: Database },
    { label: 'Loading sensor data...', icon: Zap },
    { label: 'Preparing dashboard...', icon: CheckCircle },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        
        // Update current step based on progress
        const stepIndex = Math.floor(newProgress / 25);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate('/dashboard');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [user, navigate]);

  const IconComponent = steps[currentStep]?.icon || Shield;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Welcome Message */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
            <IconComponent className="h-12 w-12 text-primary-foreground animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.user_name || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Access granted. Initializing your dashboard...
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-6">
          <Progress value={progress} className="w-full h-3" />
          
          <div className="space-y-3">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500/10 text-green-500'
                      : isCurrent
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted/30 text-muted-foreground'
                  }`}
                >
                  <StepIcon 
                    className={`h-5 w-5 ${
                      isCompleted ? 'text-green-500' : isCurrent ? 'text-primary animate-pulse' : 'text-muted-foreground'
                    }`}
                  />
                  <span className="text-sm font-medium">{step.label}</span>
                  {isCompleted && (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;