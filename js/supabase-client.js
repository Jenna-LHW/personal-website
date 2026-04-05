/* ============================================================
   js/supabase-client.js
   Initialise the Supabase client — imported by every page JS.
   Replace the two constants below with your project values from:
     Supabase Dashboard → Project Settings → API
   ============================================================ */

const SUPABASE_URL = "https://zujdvrlxiocnotwekhmw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1amR2cmx4aW9jbm90d2VraG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3ODI5ODUsImV4cCI6MjA4ODM1ODk4NX0.dVpi7fKPuLV25yuX9465o_3tGt1m0dA4ENebUNScm7c";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);