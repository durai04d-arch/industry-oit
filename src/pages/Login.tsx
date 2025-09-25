import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Zap, Shield, Scan } from 'lucide-react';

// --- Simple Toast Component (Replaces useToast hook) ---
const ToastComponent = ({ title, description, variant }) => {
  const baseStyle = "fixed top-5 right-5 w-full max-w-sm p-4 rounded-lg shadow-lg text-white animate-fade-in-down";
  const variants = {
    destructive: "bg-red-600",
    success: "bg-green-600",
  };
  const variantStyle = variants[variant] || "bg-gray-800";

  return (
    <div className={`${baseStyle} ${variantStyle}`}>
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  );
};


// --- Auth Context and Provider (Merged from AuthProvider snippet) ---
interface User {
  id: string;
  card_uid: string;
  user_name: string;
  industry?: string;
  email?: string;
  phone?: string;
  company_name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (cardUid: string) => Promise<{ success: boolean; message: string; needsSetup?: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('rfid_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (cardUid: string): Promise<{ success: boolean; message: string; needsSetup?: boolean }> => {
    setIsLoading(true);
    const testUsers = {
      'D6FCF805': { name: 'Durai', industry: 'Electronics' },
      '34DB3B6': { name: 'Vishal', industry: 'Mechanical' },
    };

    const testUser = testUsers[cardUid];
    if (!testUser) {
        setIsLoading(false);
        return { success: false, message: 'Invalid Card UID. Please use a demo card.' };
    }
    
    // Simulate API call
    await new Promise(res => setTimeout(res, 1000));

    const userData: User = {
      id: cardUid,
      card_uid: cardUid,
      user_name: testUser.name,
      industry: testUser.industry
    };

    setUser(userData);
    localStorage.setItem('rfid_user', JSON.stringify(userData));
    setIsLoading(false);
    return { success: true, message: `Access Granted - Welcome back ${testUser.name}` };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rfid_user');
  };

  const value: AuthContextType = { user, isLoading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// --- Login Component (Merged from Login snippet) ---
const Login = ({ navigate, showToast }) => {
  const [cardUid, setCardUid] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!cardUid.trim()) {
      showToast({
        title: "Invalid Input",
        description: "Please enter your RFID card number",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    const result = await login(cardUid.trim());
    
    if (result.success) {
      showToast({
        title: "Authentication Successful",
        description: result.message,
        variant: "success",
      });
      navigate(result.needsSetup ? '/industry-selection' : '/loading');
    } else {
      showToast({
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
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">RFID Access Control</h1>
          <p className="text-muted-foreground">Scan your RFID card to access the system</p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <CreditCard className="h-5 w-5" />
              Card Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground text-center">
                Demo Cards (Click to use)
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" size="sm" onClick={() => handleQuickLogin('D6FCF805')} className="justify-between text-xs">
                  <span>Durai</span>
                  <Badge variant="secondary">D6FCF805</Badge>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickLogin('34DB3B6')} className="justify-between text-xs">
                  <span>Vishal</span>
                  <Badge variant="secondary">34DB3B6</Badge>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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


// --- Placeholder Pages for Navigation ---
const LoadingPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    <p className="text-lg text-muted-foreground">Loading Dashboard...</p>
  </div>
);

const IndustrySelectionPage = ({ navigate }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Please select your industry to continue.</p>
        <Button onClick={() => navigate('/loading')} className="w-full">Confirm & Proceed to Dashboard</Button>
      </CardContent>
    </Card>
  </div>
);

const DashboardPage = ({ navigate }) => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle>Welcome, {user?.user_name}!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>You have successfully logged in.</p>
          <p>Your industry: <Badge>{user?.industry}</Badge></p>
          <Button onClick={() => { logout(); navigate('/login'); }} variant="destructive" className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};


// --- Main Component (Replaces Contact) ---
const Contact = () => {
  const [page, setPage] = useState('/login');
  const [toast, setToast] = useState(null);
  const { user } = useAuth(); // Read user from context to handle redirects

  useEffect(() => {
    // If user exists on load, redirect to dashboard
    if (user) {
      setPage('/dashboard');
    }
  }, [user]);

  const navigate = (path) => {
    if (path === '/loading') {
      setPage('/loading');
      setTimeout(() => setPage('/dashboard'), 2000); // Simulate loading time
    } else {
      setPage(path);
    }
  };

  const showToast = (toastOptions) => {
    setToast(toastOptions);
    setTimeout(() => setToast(null), 3000);
  };

  const renderPage = () => {
    switch (page) {
      case '/login':
        return <Login navigate={navigate} showToast={showToast} />;
      case '/loading':
        return <LoadingPage />;
      case '/industry-selection':
        return <IndustrySelectionPage navigate={navigate} />;
      case '/dashboard':
        return <DashboardPage navigate={navigate} />;
      default:
        return <Login navigate={navigate} showToast={showToast} />;
    }
  };
  
  return (
    <div>
        {renderPage()}
        {toast && <ToastComponent {...toast} />}
    </div>
  );
};

// --- Final Wrapper ---
const AppWrapper = () => (
  <AuthProvider>
    <Contact />
  </AuthProvider>
);

export default AppWrapper;

