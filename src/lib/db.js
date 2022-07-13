import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";

let URL = import.meta.env.VITE_SUPABASE_URL;
let KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
// if production, get KEY from Vercel
if (import.meta.env.MODE === 'production') {
    console.log("production mode");

    dotenv.config();

    console.log(process.env);

    URL = process.env["SUPABASE_URL"];
    KEY = process.env["SUPABASE_ANON_KEY"];
}

const supabase = createClient(URL, KEY);

export default supabase;