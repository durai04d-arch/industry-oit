-- Create RFID cards table for authentication
CREATE TABLE public.rfid_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_uid TEXT NOT NULL UNIQUE,
  user_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rfid_cards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading cards for authentication
CREATE POLICY "Allow reading rfid cards for authentication" 
ON public.rfid_cards 
FOR SELECT 
USING (true);

-- Create policy to allow inserting cards 
CREATE POLICY "Allow inserting rfid cards" 
ON public.rfid_cards 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rfid_cards_updated_at
  BEFORE UPDATE ON public.rfid_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample RFID cards for testing
INSERT INTO public.rfid_cards (card_uid, user_name) VALUES 
  ('1234567890', 'John Doe'),
  ('0987654321', 'Jane Smith'),
  ('1122334455', 'Admin User');