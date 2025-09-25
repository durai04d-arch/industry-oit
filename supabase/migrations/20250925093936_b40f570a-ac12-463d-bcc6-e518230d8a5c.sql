-- Fix security issue by creating proper RLS policies for rfid_cards table
-- Update policy for reading cards (more specific)
DROP POLICY IF EXISTS "Allow reading rfid cards for authentication" ON public.rfid_cards;
DROP POLICY IF EXISTS "Allow inserting rfid cards" ON public.rfid_cards;

-- Create more specific policies
CREATE POLICY "Allow reading active rfid cards for authentication" 
ON public.rfid_cards 
FOR SELECT 
USING (is_active = true);

-- Allow inserting new cards (for admin purposes)
CREATE POLICY "Allow inserting rfid cards for registration" 
ON public.rfid_cards 
FOR INSERT 
WITH CHECK (true);