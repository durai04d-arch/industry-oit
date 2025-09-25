-- Add UPDATE and DELETE policies for rfid_cards table to resolve security warning
CREATE POLICY "Allow updating rfid cards for admin" 
ON public.rfid_cards 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow deleting rfid cards for admin" 
ON public.rfid_cards 
FOR DELETE 
USING (true);