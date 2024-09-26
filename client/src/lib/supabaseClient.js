import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://ihsuxbkmjlsefewexelu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloc3V4YmttamxzZWZld2V4ZWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczODIxMTMsImV4cCI6MjA0Mjk1ODExM30.G5-v6E-zWvmGhezu2dUq0QuyKRmHqe3877O7spSwIOs')