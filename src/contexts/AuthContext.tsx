import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('rfid_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (cardUid: string): Promise<{ success: boolean; message: string; needsSetup?: boolean }> => {
    try {
      setIsLoading(true);
      
      // Simple ID-based authentication for testing
      const testUsers: { [key: string]: { name: string; industry?: string } } = {
        '1234567890': { name: 'Durai', industry: 'Agriculture' },
        '0987654321': { name: 'Vishal', industry: 'Mechanical' },
        '1122334455': { name: 'Admin User', industry: 'Electronics' },
        '1111111111': { name: 'Test User 1', industry: 'Agriculture' },
        '2222222222': { name: 'Test User 2', industry: 'Mechanical' },
        '3333333333': { name: 'Test User 3', industry: 'Electronics' }
      };

      const testUser = testUsers[cardUid];
      
      if (!testUser) {
        return { success: false, message: 'Invalid ID - Please use a valid test ID number' };
      }

      // Check if user profile exists in database
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('card_uid', cardUid)
        .maybeSingle();

      if (profileError) {
        console.error('Profile check error:', profileError);
      }

      if (!profileData) {
        // User needs to complete setup
        localStorage.setItem('temp_card_uid', cardUid);
        return { 
          success: true, 
          message: `Welcome ${testUser.name}! Please complete your profile setup.`,
          needsSetup: true 
        };
      }

      const userData: User = {
        id: cardUid,
        card_uid: cardUid,
        user_name: testUser.name,
        industry: profileData.industry || testUser.industry,
        email: profileData.email,
        phone: profileData.phone,
        company_name: profileData.company_name
      };

      setUser(userData);
      localStorage.setItem('rfid_user', JSON.stringify(userData));
      
      return { success: true, message: `Access Granted - Welcome back ${testUser.name}` };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'System Error - Please Try Again' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rfid_user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
