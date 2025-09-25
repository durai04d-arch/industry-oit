import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, Building, Save, Edit } from 'lucide-react';

const userProfileSchema = z.object({
  user_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address').max(255, 'Email must be less than 255 characters').optional().or(z.literal('')),
  phone: z.string().min(0).max(15, 'Phone number must be less than 15 digits').optional().or(z.literal('')),
  company_name: z.string().min(0).max(100, 'Company name must be less than 100 characters').optional().or(z.literal(''))
});

type UserProfileForm = z.infer<typeof userProfileSchema>;

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      user_name: '',
      email: '',
      phone: '',
      company_name: ''
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        user_name: user.user_name || '',
        email: user.email || '',
        phone: user.phone || '',
        company_name: user.company_name || ''
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UserProfileForm) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          user_name: data.user_name,
          email: data.email || null,
          phone: data.phone || null,
          company_name: data.company_name || null
        })
        .eq('card_uid', user.card_uid);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      
      setIsEditing(false);
      
      // Update user data in localStorage
      const updatedUser = {
        ...user,
        user_name: data.user_name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        company_name: data.company_name || undefined
      };
      localStorage.setItem('rfid_user', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">User Profile</CardTitle>
                <CardDescription>
                  View and manage your personal information
                </CardDescription>
              </div>
              {!isEditing && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
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
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                            disabled={!isEditing}
                          />
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
                          <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            {...field} 
                            disabled={!isEditing}
                          />
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
                          <Input 
                            type="tel" 
                            placeholder="Enter your phone number" 
                            {...field} 
                            disabled={!isEditing}
                          />
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
                          <Input 
                            placeholder="Enter your company name" 
                            {...field} 
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Account Information</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium">Card ID:</span> {user.card_uid}</p>
                    <p><span className="font-medium">Industry:</span> {user.industry}</p>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;