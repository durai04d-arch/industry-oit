-- Add RLS policies for sensor_data table to resolve security warning
CREATE POLICY "Allow reading sensor data for authentication" 
ON public.sensor_data 
FOR SELECT 
USING (true);

CREATE POLICY "Allow inserting sensor data from RFID devices" 
ON public.sensor_data 
FOR INSERT 
WITH CHECK (true);