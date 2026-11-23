import { StorageValue } from 'zustand/middleware';

const CACHE_NAME = 'farkle-storage-v1';

export interface CacheStorageConfig {
  name: string;
  version?: number;
}

// In-memory cache to store data synchronously
const memoryCache: Record<string, string> = {};

// Check if Cache API is available
const isCacheApiAvailable = (): boolean => {
  return typeof caches !== 'undefined';
};

// Initialize cache - open the cache once and reuse it
let cachePromise: Promise<Cache> | null = null;

const getCache = async (cacheName: string): Promise<Cache | null> => {
  if (!isCacheApiAvailable()) {
    return null;
  }
  
  if (!cachePromise) {
    cachePromise = caches.open(cacheName).catch(() => null);
  }
  
  return cachePromise;
};

export const createCacheStorage = (config: CacheStorageConfig) => {
  const cacheName = config.version ? `${config.name}-v${config.version}` : config.name;

  return {
    getItem: async <T>(name: string): Promise<T | null> => {
      // First check in-memory cache
      if (memoryCache[name]) {
        try {
          return JSON.parse(memoryCache[name]) as T;
        } catch {
          return null;
        }
      }
      
      try {
        const cache = await getCache(cacheName);
        if (!cache) {
          return null;
        }
        
        const response = await cache.match(name);
        
        if (!response) {
          return null;
        }
        
        const data = await response.json();
        // Store in memory cache for faster access
        memoryCache[name] = JSON.stringify(data.value);
        return data.value as T;
      } catch (error) {
        console.error('Failed to read from cache:', error);
        return null;
      }
    },
    setItem: async <T>(name: string, value: T): Promise<void> => {
      // Store in memory cache
      memoryCache[name] = JSON.stringify(value);
      
      try {
        const cache = await getCache(cacheName);
        if (!cache) {
          return;
        }
        
        const response = new Response(
          JSON.stringify({ value }),
          { headers: { 'Content-Type': 'application/json' } }
        );
        await cache.put(name, response);
      } catch (error) {
        console.error('Failed to write to cache:', error);
      }
    },
    removeItem: async (name: string): Promise<void> => {
      // Remove from memory cache
      delete memoryCache[name];
      
      try {
        const cache = await getCache(cacheName);
        if (!cache) {
          return;
        }
        
        await cache.delete(name);
      } catch (error) {
        console.error('Failed to remove from cache:', error);
      }
    },
    clear: async (): Promise<void> => {
      // Clear memory cache
      Object.keys(memoryCache).forEach(key => delete memoryCache[key]);
      
      try {
        const cache = await getCache(cacheName);
        if (!cache) {
          return;
        }
        
        const keys = await cache.keys();
        await Promise.all(keys.map(key => cache.delete(key)));
      } catch (error) {
        console.error('Failed to clear cache:', error);
      }
    },
  };
};

// Sync wrapper for Zustand's StorageValue interface
export const createSyncCacheStorage = (config: CacheStorageConfig): StorageValue => {
  const cacheStorage = createCacheStorage(config);

  return {
    getItem: (name: string) => {
      // Zustand persist expects synchronous operations
      // We'll use in-memory cache as the primary storage
      // and sync with Cache API asynchronously
      if (memoryCache[name]) {
        return memoryCache[name];
      }
      return null;
    },
    setItem: (name: string, value: string) => {
      // Store in memory cache
      memoryCache[name] = value;
      // Sync with Cache API asynchronously
      cacheStorage.setItem(name, value).catch(console.error);
    },
    removeItem: (name: string) => {
      // Remove from memory cache
      delete memoryCache[name];
      // Sync with Cache API asynchronously
      cacheStorage.removeItem(name).catch(console.error);
    },
  };
};

// Pre-configured storage for farkle
export const farkleCacheStorage = createSyncCacheStorage({
  name: 'farkle-storage',
  version: 1,
});

// Initialize: Load data from Cache API to memory cache on first use
export const initCacheStorage = async (config: CacheStorageConfig): Promise<void> => {
  const cacheStorage = createCacheStorage(config);
  const cacheName = config.version ? `${config.name}-v${config.version}` : config.name;
  
  try {
    const cache = await getCache(cacheName);
    if (!cache) {
      return;
    }
    
    const keys = await cache.keys();
    await Promise.all(
      keys.map(async (request) => {
        const response = await cache.match(request);
        if (response) {
          const data = await response.json();
          memoryCache[request.url] = JSON.stringify(data.value);
        }
      })
    );
  } catch (error) {
    console.error('Failed to initialize cache storage:', error);
  }
};

// Optional: Initialize cache storage when the app loads
// This can be called in main.tsx or similar entry point
// initCacheStorage({ name: 'farkle-storage', version: 1 });

