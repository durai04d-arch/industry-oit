-- Create sensor_readings table for IoT dashboard
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sensor_type TEXT NOT NULL,
  sensor_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for demo purposes)
CREATE POLICY "Anyone can view sensor readings" 
ON public.sensor_readings 
FOR SELECT 
USING (true);

-- Create policy for public insert (for demo/testing purposes)
CREATE POLICY "Anyone can insert sensor readings" 
ON public.sensor_readings 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_sensor_readings_type_created ON public.sensor_readings(sensor_type, created_at DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sensor_readings_updated_at
BEFORE UPDATE ON public.sensor_readings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the table
ALTER TABLE public.sensor_readings REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.sensor_readings;

-- Insert sample data for demonstration
INSERT INTO public.sensor_readings (sensor_type, sensor_name, value, unit, location) VALUES
('temperature', 'Temperature Sensor A1', 29.5, '°C', 'Production Line 1'),
('methane', 'Methane Detector B2', 750, 'PPM', 'Storage Area'),
('vibration', 'Vibration Monitor C3', 2.3, 'mm/s', 'Motor Assembly'),
('pressure', 'Pressure Gauge D4', 145, 'PSI', 'Hydraulic System'),
('humidity', 'Humidity Sensor E5', 45, '%', 'Clean Room'),
('voltage', 'Voltage Monitor F6', 415, 'V', 'Electrical Panel');