-- Ensure REPLICA IDENTITY FULL is set for sensor_readings table
ALTER TABLE public.sensor_readings REPLICA IDENTITY FULL;