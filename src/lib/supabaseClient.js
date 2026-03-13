import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://pisxagqebmudthhrtqvc.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpc3hhZ3FlYm11ZHRoaHJ0cXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNzA5NDcsImV4cCI6MjA4ODY0Njk0N30.UfnC_5pt9dIxbb6nUJXph1KS5SX6F1kduFN0mZ00u7k"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)