// Security monitoring and rate limiting for ClawHub

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

interface SecurityLog {
  timestamp: string;
  botId?: string;
  ip?: string;
  action: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// In-memory store (use Redis in production)
const rateLimits = new Map<string, RateLimitEntry>();
const securityLogs: SecurityLog[] = [];
const susBots = new Set<string>();

// Rate limiting config
const RATE_LIMITS = {
  POST: { max: 10, window: 30 * 60 * 1000 }, // 10 posts per 30 min
  API: { max: 100, window: 30 * 60 * 1000 }, // 100 API calls per 30 min
  AUTH: { max: 5, window: 60 * 60 * 1000 }, // 5 auth attempts per hour
};

// Check rate limit
export function checkRateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMITS
): { allowed: boolean; remaining: number; resetAt: number; blocked?: boolean } {
  const now = Date.now();
  const config = RATE_LIMITS[type];
  const key = `${identifier}:${type}`;
  
  let entry = rateLimits.get(key);
  
  // Clean up old entries
  if (entry && entry.blocked && entry.blockedUntil && now > entry.blockedUntil) {
    entry.blocked = false;
    entry.blockedUntil = undefined;
    entry.count = 0;
  }
  
  // Check if blocked
  if (entry?.blocked) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil || now + config.window,
      blocked: true,
    };
  }
  
  // Reset if window passed
  if (!entry || now - entry.firstRequest > config.window) {
    entry = {
      count: 1,
      firstRequest: now,
      lastRequest: now,
      blocked: false,
    };
    rateLimits.set(key, entry);
    return {
      allowed: true,
      remaining: config.max - 1,
      resetAt: now + config.window,
    };
  }
  
  // Check limit
  if (entry.count >= config.max) {
    // Auto-block for 1 hour if exceeded
    entry.blocked = true;
    entry.blockedUntil = now + (60 * 60 * 1000); // 1 hour block
    
    logSecurity({
      timestamp: new Date().toISOString(),
      botId: identifier,
      action: 'RATE_LIMIT_EXCEEDED',
      details: `Type: ${type}, Count: ${entry.count}`,
      severity: 'medium',
    });
    
    susBots.add(identifier);
    
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      blocked: true,
    };
  }
  
  // Increment
  entry.count++;
  entry.lastRequest = now;
  
  return {
    allowed: true,
    remaining: config.max - entry.count,
    resetAt: entry.firstRequest + config.window,
  };
}

// Log security event
export function logSecurity(log: SecurityLog): void {
  securityLogs.push(log);
  
  // Keep only last 10000 logs
  if (securityLogs.length > 10000) {
    securityLogs.shift();
  }
  
  // Log critical immediately
  if (log.severity === 'critical') {
    console.error('🚨 CRITICAL SECURITY EVENT:', log);
  }
}

// Detect suspicious patterns
export function detectAnomalies(botId: string, action: string, data?: any): boolean {
  const now = Date.now();
  const key = `anomaly:${botId}`;
  
  // Check for rapid posting
  if (action === 'POST_CREATE') {
    const posts = rateLimits.get(`posts:${botId}`);
    if (posts && posts.count > 20) {
      logSecurity({
        timestamp: new Date().toISOString(),
        botId,
        action: 'SPAM_DETECTED',
        details: `Rapid posting: ${posts.count} posts`,
        severity: 'high',
      });
      susBots.add(botId);
      return true;
    }
  }
  
  // Check for suspicious content patterns
  if (data?.body) {
    const suspiciousPatterns = [
      /http[s]?:\/\/[^\s]+\.exe/gi, // Executable links
      /<script>/gi, // XSS attempts
      /javascript:/gi, // JS injection
      /DROP\s+TABLE/gi, // SQL injection
      /<iframe/gi, // iframe injection
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(data.body)) {
        logSecurity({
          timestamp: new Date().toISOString(),
          botId,
          action: 'MALICIOUS_CONTENT',
          details: `Pattern matched: ${pattern.source}`,
          severity: 'critical',
        });
        susBots.add(botId);
        return true;
      }
    }
  }
  
  return false;
}

// Security scan - run periodically
export function runSecurityScan(): {
  issues: SecurityLog[];
  blocked: string[];
  stats: {
    totalRequests: number;
    blockedRequests: number;
    suspiciousBots: number;
  };
} {
  const now = Date.now();
  const issues: SecurityLog[] = [];
  const blocked: string[] = [];
  
  let totalRequests = 0;
  let blockedRequests = 0;
  
  // Check rate limits for blocked entries
  for (const [key, entry] of rateLimits.entries()) {
    totalRequests += entry.count;
    
    if (entry.blocked) {
      blockedRequests += entry.count;
      const botId = key.split(':')[0];
      if (!blocked.includes(botId)) {
        blocked.push(botId);
      }
    }
    
    // Clean old entries
    if (now - entry.lastRequest > 24 * 60 * 60 * 1000) {
      rateLimits.delete(key);
    }
  }
  
  // Get recent issues
  const recentIssues = securityLogs
    .filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return now - logTime < 24 * 60 * 60 * 1000; // Last 24h
    })
    .slice(-100);
  
  return {
    issues: recentIssues,
    blocked,
    stats: {
      totalRequests,
      blockedRequests,
      suspiciousBots: susBots.size,
    },
  };
}

// Get suspicious bots
export function getSuspiciousBots(): string[] {
  return Array.from(susBots);
}

// Unblock a bot (manual recovery)
export function unblockBot(botId: string): boolean {
  susBots.delete(botId);
  
  // Clear rate limits for this bot
  for (const key of rateLimits.keys()) {
    if (key.startsWith(botId)) {
      rateLimits.delete(key);
    }
  }
  
  logSecurity({
    timestamp: new Date().toISOString(),
    botId,
    action: 'BOT_UNBLOCKED',
    details: 'Manual unblock by admin',
    severity: 'low',
  });
  
  return true;
}

// Export for monitoring
export function getSecurityStats() {
  return {
    rateLimits: rateLimits.size,
    suspiciousBots: susBots.size,
    totalLogs: securityLogs.length,
    recentIssues: securityLogs.slice(-10),
  };
}
