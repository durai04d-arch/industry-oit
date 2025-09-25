import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Building } from 'lucide-react';

const userDetailsSchema = z.object({
  user_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address').max(255, 'Email must be less than 255 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits'),
  company_name: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name must be less than 100 characters')
});

type UserDetailsForm = z.infer<typeof userDetailsSchema>;

const UserDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserDetailsForm>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      user_name: '',
      email: '',
      phone: '',
      company_name: ''
    }
  });

  const onSubmit = async (data: UserDetailsForm) => {
    try {
      setIsSubmitting(true);
      
      const industry = localStorage.getItem('selected_industry');
      const cardUid = localStorage.getItem('temp_card_uid') || 'TEST_CARD_001';
      
      if (!industry) {
        toast({
          title: "Error",
          description: "Industry selection is required. Please go back and select an industry.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('user_profiles')
        .insert({
          card_uid: cardUid,
          user_name: data.user_name,
          industry: industry,
          email: data.email,
          phone: data.phone,
          company_name: data.company_name
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save user details. Please try again.",
          variant: "destructive"
        });
        return;
      }

      localStorage.removeItem('temp_card_uid');
      localStorage.removeItem('selected_industry');
      
      toast({
        title: "Success",
        description: "User details saved successfully!",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving user details:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">User Details</CardTitle>
          <CardDescription className="text-center">
            Please provide your basic information to complete setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Details & Continue"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;