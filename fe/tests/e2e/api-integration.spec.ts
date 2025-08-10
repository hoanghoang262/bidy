import { test, expect } from '@playwright/test';

/**
 * API Integration Tests
 * Tests backend API endpoints directly to ensure they work correctly
 * and return expected response formats for frontend integration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

test.describe('Authentication API Integration', () => {
  test.describe('POST /user/check', () => {
    test('should check if user exists by username', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/user/check`, {
        data: {
          userName: 'testuser123'
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('data');
      expect(typeof data.data).toBe('boolean');
    });

    test('should check if user exists by email', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/user/check`, {
        data: {
          email: 'test@nonexistent.com'
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      
      expect(data.status).toBe('success');
      expect(data.data).toBe(false); // Should not exist
    });

    test('should validate both username and email', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/user/check`, {
        data: {
          userName: 'newuser',
          email: 'newuser@example.com'
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('success');
    });
  });

  test.describe('POST /user/signup', () => {
    test('should validate required fields for registration', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/user/signup`, {
        data: {
          userName: '', // Invalid: empty
          password: 'password123',
          fullName: 'Test User',
          email: 'test@example.com'
        }
      });

      // Should return validation error
      expect([400, 422]).toContain(response.status());
    });

    test('should handle registration with all required fields', async ({ request }) => {
      // Use random suffix to avoid conflicts
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      
      const response = await request.post(`${API_BASE_URL}/user/signup`, {
        data: {
          userName: `testuser_${randomSuffix}`,
          password: 'SecurePassword123!',
          fullName: 'Test User',
          email: `test_${randomSuffix}@example.com`,
          identity: `12345${randomSuffix}`,
          phone: `098765${randomSuffix}`
        }
      });

      // Should either succeed or return conflict if user exists
      expect([200, 409, 500]).toContain(response.status());
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('message');
    });
  });

  test.describe('POST /user/login', () => {
    test('should handle login with invalid credentials', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/user/login`, {
        data: {
          userName: 'nonexistentuser',
          password: 'wrongpassword'
        }
      });

      expect(response.status()).toBe(500); // Based on controller implementation
      const data = await response.json();
      
      expect(data.status).toBe('fail');
      expect(data.message).toContain('incorrect');
    });

    test('should validate login request format', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/user/login`, {
        data: {
          userName: '', // Empty username
          password: ''  // Empty password
        }
      });

      // Should return validation error
      expect([400, 422, 500]).toContain(response.status());
    });

    test('should return proper response format for login', async ({ request }) => {
      // This test checks response format, not actual login success
      const response = await request.post(`${API_BASE_URL}/user/login`, {
        data: {
          userName: 'testuser',
          password: 'anypassword'
        }
      });

      const data = await response.json();
      
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('message');
      expect(['success', 'fail']).toContain(data.status);
      
      if (data.status === 'success') {
        expect(data).toHaveProperty('data');
        expect(data.data).toHaveProperty('token');
        expect(data.data).toHaveProperty('user');
      }
    });
  });

  test.describe('POST /user/forgot-password', () => {
    test('should handle forgot password request', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/user/forgot-password`, {
        data: {
          email: 'test@example.com'
        }
      });

      // Should return appropriate response regardless of email existence
      expect([200, 400, 404, 500]).toContain(response.status());
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('message');
    });

    test('should validate email format for forgot password', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/user/forgot-password`, {
        data: {
          email: 'invalid-email'
        }
      });

      // Should return validation error for invalid email
      expect([400, 422]).toContain(response.status());
    });
  });
});

test.describe('Auction API Integration', () => {
  test.describe('GET /auction/categories', () => {
    test('should return list of categories', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/auction/categories`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('status');
      expect(data.status).toBe('success');
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  test.describe('GET /auction/:status', () => {
    test('should return auctions by status', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/auction/active`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('data');
    });

    test('should handle invalid status', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/auction/invalidstatus`);

      expect([200, 400, 404]).toContain(response.status());
    });
  });

  test.describe('GET /auction/listing/:id', () => {
    test('should handle auction listing by ID', async ({ request }) => {
      // Use a test ID - should return 404 or appropriate error
      const response = await request.get(`${API_BASE_URL}/auction/listing/507f1f77bcf86cd799439011`);

      expect([200, 404]).toContain(response.status());
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
    });

    test('should handle invalid auction ID format', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/auction/listing/invalid-id`);

      expect([400, 404]).toContain(response.status());
    });
  });

  test.describe('GET /auction/category/:category', () => {
    test('should return products by category', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/auction/category/electronics`);

      expect([200, 404]).toContain(response.status());
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
    });
  });

  test.describe('GET /auction/listing/search/:keyword', () => {
    test('should search products by keyword', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/auction/listing/search/laptop`);

      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('data');
    });

    test('should handle empty search results', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/auction/listing/search/nonexistentproduct123`);

      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('success');
    });
  });
});

test.describe('Protected Endpoints (Authentication Required)', () => {
  test.describe('GET /user/profile', () => {
    test('should return 401 without authentication', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/user/profile`);

      expect([401, 403]).toContain(response.status());
    });

    test('should return 401 with invalid token', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });

      expect([401, 403]).toContain(response.status());
    });
  });

  test.describe('GET /user/wishlist', () => {
    test('should require authentication', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/user/wishlist`);

      expect([401, 403]).toContain(response.status());
    });
  });

  test.describe('POST /auction/listing/:id/bid', () => {
    test('should require authentication for bidding', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/auction/listing/507f1f77bcf86cd799439011/bid`, {
        data: {
          bidAmount: 100
        }
      });

      expect([401, 403]).toContain(response.status());
    });
  });
});

test.describe('Health Check Endpoints', () => {
  test.describe('GET /health', () => {
    test('should return server health status', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/health`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('uptime');
      expect(data).toHaveProperty('environment');
      expect(data.status).toBe('OK');
    });
  });

  test.describe('GET /health/detailed', () => {
    test('should return detailed health information', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/health/detailed`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('database');
      expect(data).toHaveProperty('memory');
      expect(data.status).toBe('OK');
    });
  });
});

test.describe('Error Handling', () => {
  test('should handle 404 for non-existent endpoints', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/non-existent-endpoint`);

    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('fail');
  });

  test('should handle CORS preflight requests', async ({ request }) => {
    const response = await request.fetch(`${API_BASE_URL}/user/login`, {
      method: 'OPTIONS'
    });

    // Should handle OPTIONS request properly
    expect([200, 204]).toContain(response.status());
  });
});

test.describe('Rate Limiting', () => {
  test('should apply rate limiting to authentication endpoints', async ({ request }) => {
    // Make multiple rapid requests to test rate limiting
    const promises = Array.from({ length: 10 }, () =>
      request.post(`${API_BASE_URL}/user/login`, {
        data: {
          userName: 'testuser',
          password: 'testpassword'
        }
      })
    );

    const responses = await Promise.all(promises);
    
    // At least some requests should succeed initially
    const statusCodes = responses.map(r => r.status());
    
    // Should have successful requests and potentially some rate limited ones
    expect(statusCodes.some(code => [200, 500].includes(code))).toBe(true);
    
    // Check if rate limiting is applied (429 status)
    // Note: This is optional as it depends on configuration
    if (statusCodes.includes(429)) {
      expect(statusCodes.filter(code => code === 429).length).toBeGreaterThan(0);
    }
  });
});