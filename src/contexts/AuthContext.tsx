import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  card_uid: string;
  user_name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (cardUid: string) => Promise<{ success: boolean; message: string }>;
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

  const login = async (cardUid: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      // Check if RFID card exists and is active
      const { data: cardData, error: cardError } = await supabase
        .from('rfid_cards')
        .select('*')
        .eq('card_uid', cardUid)
        .eq('is_active', true)
        .single();

      if (cardError || !cardData) {
        return { success: false, message: 'Access Denied - Invalid Card' };
      }

      // Check for recent sensor data (last 5 minutes) with matching card_uid
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: sensorData, error: sensorError } = await supabase
        .from('sensor_data')
        .select('*')
        .eq('card_uid', cardUid)
        .gte('created_at', fiveMinutesAgo)
        .order('created_at', { ascending: false })
        .limit(1);

      if (sensorError || !sensorData || sensorData.length === 0) {
        return { 
          success: false, 
          message: 'Access Denied - No recent sensor activity detected. Please scan your card at the sensor station first.' 
        };
      }

      const userData: User = {
        id: cardData.id,
        card_uid: cardData.card_uid,
        user_name: cardData.user_name,
      };

      setUser(userData);
      localStorage.setItem('rfid_user', JSON.stringify(userData));
      
      return { success: true, message: `Access Granted - Welcome ${cardData.user_name}` };
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