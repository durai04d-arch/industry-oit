import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Factory, Tractor, Cpu } from 'lucide-react';

const IndustrySelection = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

  const industries = [
    {
      id: 'Agriculture',
      name: 'Agriculture',
      description: 'Farming, crop monitoring, livestock management',
      icon: Tractor,
      color: 'bg-green-500'
    },
    {
      id: 'Mechanical',
      name: 'Mechanical',
      description: 'Manufacturing, machinery, industrial processes',
      icon: Factory,
      color: 'bg-blue-500'
    },
    {
      id: 'Electronics',
      name: 'Electronics',
      description: 'Technology, semiconductors, circuit design',
      icon: Cpu,
      color: 'bg-purple-500'
    }
  ];

  const handleIndustrySelect = (industry: string) => {
    setSelectedIndustry(industry);
    localStorage.setItem('selected_industry', industry);
    navigate('/user-details');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Select Your Industry</h1>
          <p className="text-muted-foreground">Choose your industry to get customized dashboard insights</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {industries.map((industry) => {
            const Icon = industry.icon;
            return (
              <Card 
                key={industry.id}
                className="cursor-pointer hover:shadow-tech transition-all duration-300 hover:scale-105 border-2 hover:border-primary"
                onClick={() => handleIndustrySelect(industry.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${industry.color} mx-auto flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{industry.name}</CardTitle>
                  <CardDescription>{industry.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="w-full justify-center">
                    Select Industry
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IndustrySelection;