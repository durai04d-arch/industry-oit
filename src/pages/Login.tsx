import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

import { useAuth } from '@/contexts/AuthContext';

import { useToast } from '@/hooks/use-toast';

import { CreditCard, Zap, Shield, Scan } from 'lucide-react';



const Login: React.FC = () => {

  const [cardUid, setCardUid] = useState('');

  const [isScanning, setIsScanning] = useState(false);

  const { login, user } = useAuth();

  const { toast } = useToast();

  const navigate = useNavigate();



  useEffect(() => {

    if (user) {

      navigate('/loading');

    }

  }, [user, navigate]);



  const handleLogin = async () => {

    if (!cardUid.trim()) {

      toast({

        title: "Invalid Input",

        description: "Please enter your RFID card number",

        variant: "destructive",

      });

      return;

    }



    setIsScanning(true);

    const result = await login(cardUid.trim());

    

    if (result.success) {

      toast({

        title: "Authentication Successful",

        description: result.message,

        className: "bg-green-500 text-white",

      });

      

      if (result.needsSetup) {

        navigate('/industry-selection');

      } else {

        navigate('/loading');

      }

    } else {

      toast({

        title: "Authentication Failed",

        description: result.message,

        variant: "destructive",

      });

    }

    setIsScanning(false);

  };



  const handleQuickLogin = (testCardUid: string) => {

    setCardUid(testCardUid);

  };



  return (

    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4">

      <div className="w-full max-w-md space-y-6">

        {/* Header */}

        <div className="text-center space-y-4">

          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">

            <Shield className="h-10 w-10 text-primary-foreground" />

          </div>

          <h1 className="text-3xl font-bold text-foreground">RFID Access Control</h1>

          <p className="text-muted-foreground">Scan your RFID card to access the system</p>

        </div>



        {/* Login Card */}

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">

          <CardHeader className="text-center">

            <CardTitle className="flex items-center justify-center gap-2">

              <CreditCard className="h-5 w-5" />

              Card Authentication

            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-6">

            {/* RFID Input */}

            <div className="space-y-2">

              <label className="text-sm font-medium text-foreground">

                RFID Card Number

              </label>

              <Input

                type="text"

                placeholder="Scan or enter card UID..."

                value={cardUid}

                onChange={(e) => setCardUid(e.target.value)}

                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}

                className="bg-background/50"

              />

            </div>



            {/* Scan Button */}

            <Button

              onClick={handleLogin}

              disabled={isScanning}

              className="w-full"

              variant="hero"

            >

              {isScanning ? (

                <>

                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />

                  Authenticating...

                </>

              ) : (

                <>

                  <Scan className="h-4 w-4 mr-2" />

                  Authenticate Card

                </>

              )}

            </Button>

            

            <Button 

              onClick={() => {

                // Set a demo user for testing

                const demoUser = {

                  id: 'demo-user-id',

                  card_uid: 'DEMO_CARD_123',

                  user_name: 'Demo User',

                  industry: 'Electronics'

                };

                localStorage.setItem('rfid_user', JSON.stringify(demoUser));

                navigate('/loading');

              }} 

              variant="outline"

              className="w-full mt-2"

            >

              Skip Verification (Testing)

            </Button>



            {/* Demo Cards */}

            <div className="space-y-3">

              <div className="text-sm font-medium text-muted-foreground text-center">

                Demo Cards (Click to use)

              </div>

              <div className="grid grid-cols-1 gap-2">

                <Button

                  variant="outline"

                  size="sm"

                  onClick={() => handleQuickLogin('D6FCF805')}

                  className="justify-between text-xs"

                >

                  <span>Durai</span>

                  <Badge variant="secondary">D6FCF805</Badge>

                </Button>

                <Button

                  variant="outline"

                  size="sm"

                  onClick={() => handleQuickLogin('34DB3B6')}

                  className="justify-between text-xs"

                >

                  <span>Vishal</span>

                  <Badge variant="secondary">34DB3B6</Badge>

                </Button>

                <Button

                  variant="outline"

                  size="sm"

                  onClick={() => handleQuickLogin('D6FCF805')}

                  className="justify-between text-xs"

                >

                  <span>Admin User</span>

                  <Badge variant="secondary">D6FCF805</Badge>

                </Button>

              </div>

            </div>

          </CardContent>

        </Card>



        {/* Status Indicators */}

        <div className="flex justify-center gap-4">

          <div className="flex items-center gap-2 text-sm text-muted-foreground">

            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

            System Online

          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">

            <Zap className="h-3 w-3" />

            RFID Ready

          </div>

        </div>

      </div>

    </div>

  );

};



export default Login;
