// Simple in-memory cache for performance optimization
class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map(); // Time-to-live tracking
  }

  // Set cache with optional TTL (time-to-live in milliseconds)
  set(key, value, ttlMs = 300000) { // Default 5 minutes
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlMs);
    return true;
  }

  // Get cache value
  get(key) {
    const ttlTime = this.ttl.get(key);
    
    // Check if expired
    if (ttlTime && Date.now() > ttlTime) {
      this.cache.delete(key);
      this.ttl.delete(key);
      return null;
    }

    return this.cache.get(key) || null;
  }

  // Check if key exists and not expired
  has(key) {
    const ttlTime = this.ttl.get(key);
    
    if (ttlTime && Date.now() > ttlTime) {
      this.cache.delete(key);
      this.ttl.delete(key);
      return false;
    }

    return this.cache.has(key);
  }

  // Delete specific key
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
    return true;
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.ttl.clear();
    return true;
  }

  // Get cache statistics
  stats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Clean expired entries (called periodically)
  cleanExpired() {
    const now = Date.now();
    for (const [key, expireTime] of this.ttl.entries()) {
      if (now > expireTime) {
        this.cache.delete(key);
        this.ttl.delete(key);
      }
    }
  }
}

// Create global cache instance
const cache = new MemoryCache();

// Clean expired entries every 10 minutes
setInterval(() => {
  cache.cleanExpired();
}, 600000);

// Cache keys for different data types
const CACHE_KEYS = {
  CATEGORIES: 'categories_all',
  USER_PROFILE: (id) => `user_profile_${id}`,
  AUCTION_STATS: 'auction_stats',
  POPULAR_AUCTIONS: 'popular_auctions'
};

// Cache TTL settings (in milliseconds)
const CACHE_TTL = {
  CATEGORIES: 3600000,    // 1 hour (categories don't change often)
  USER_PROFILE: 300000,   // 5 minutes
  AUCTION_STATS: 600000,  // 10 minutes
  POPULAR_AUCTIONS: 300000 // 5 minutes
};

module.exports = {
  cache,
  CACHE_KEYS,
  CACHE_TTL
};