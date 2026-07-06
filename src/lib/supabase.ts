/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { getSupabase } from '../services/db';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Warning: Supabase environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing.');
}

// Fallback client if configuration is not yet loaded in db.ts
let fallbackClientInstance: any = null;
function getActiveClient() {
  const active = getSupabase();
  if (active) return active;
  
  if (!fallbackClientInstance) {
    fallbackClientInstance = (supabaseUrl && supabaseAnonKey)
      ? createClient(supabaseUrl, supabaseAnonKey)
      : createClient('https://placeholder.supabase.co', 'placeholder');
  }
  return fallbackClientInstance;
}

// Dynamic Proxy for the supabase client to guarantee we always use the singleton from db.ts
// while maintaining complete transparent API compatibility.
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const active = getActiveClient();
    const value = (active as any)[prop];
    if (typeof value === 'function') {
      return value.bind(active);
    }
    return value;
  },
  set(target, prop, value) {
    const active = getActiveClient();
    (active as any)[prop] = value;
    return true;
  }
});

export async function uploadFileToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;
  const bucketName = 'zentriya';

  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (!listError && buckets) {
      const exists = buckets.some(b => b.name === bucketName);
      if (!exists) {
        await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      }
    }
  } catch (e) {
    console.warn('Bucket checking/creation warning:', e);
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}


