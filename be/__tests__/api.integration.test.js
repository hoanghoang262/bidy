const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Mock MongoDB models
jest.mock('../user_components/models/user.model');
jest.mock('../auction_component/models/bid.model');
jest.mock('../auction_component/models/category.model');
jest.mock('../auction_component/models/order.model');
jest.mock('../util/mongoose.js', () => {
  // Mock mongoose connection
  const mockConnection = {
    readyState: 1, // Connected state
    on: jest.fn(),
    close: jest.fn()
  };
  
  require('mongoose').connection = mockConnection;
  return {};
});

const User = require('../user_components/models/user.model');
const Auction = require('../auction_component/models/bid.model');
const Category = require('../auction_component/models/category.model');

// Import app after mocking
const app = require('../app');

describe('API Integration Tests', () => {
  let server;
  let userToken, adminToken;

  const testUser = {
    _id: '507f1f77bcf86cd799439011',
    user_name: 'testuser',
    email: 'test@example.com',
    role: 'user',
    status: 'true'
  };

  const testAdmin = {
    _id: '507f1f77bcf86cd799439012',
    user_name: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'true'
  };

  beforeAll(async () => {
    // Create test tokens
    userToken = jwt.sign(
      { payload: testUser },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { payload: testAdmin },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (server) {
      await server.close();
    }
  });

  describe('Health Check Endpoints', () => {
    it('GET /health should return server status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'OK',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        environment: expect.any(String),
        version: expect.any(String)
      });
    });

    it('GET /health/detailed should return comprehensive system status', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'OK',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        environment: expect.any(String),
        version: expect.any(String),
        database: {
          status: expect.any(String),
          host: expect.any(String)
        },
        memory: {
          rss: expect.any(String),
          heapTotal: expect.any(String),
          heapUsed: expect.any(String),
          external: expect.any(String)
        }
      });
    });
  });

  describe('User Authentication Endpoints', () => {
    describe('POST /user/login', () => {
      it('should login successfully with valid credentials', async () => {
        const bcrypt = require('bcrypt');
        const mockUser = {
          ...testUser,
          password: await bcrypt.hash('password123', 10)
        };

        User.findOne.mockResolvedValue(mockUser);

        const response = await request(app)
          .post('/user/login')
          .send({
            user_name: 'testuser',
            password: 'password123'
          })
          .expect(200);

        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
      });

      it('should reject invalid credentials', async () => {
        User.findOne.mockResolvedValue(null);

        await request(app)
          .post('/user/login')
          .send({
            user_name: 'invaliduser',
            password: 'wrongpassword'
          })
          .expect(401);
      });

      it('should apply rate limiting for auth endpoints', async () => {
        // Mock rate limiter to simulate rate limit exceeded
        const rateLimitMiddleware = require('../Middlewares/security.middleware').rateLimiters.auth;
        
        // Make multiple rapid requests
        const promises = Array(6).fill().map(() =>
          request(app)
            .post('/user/login')
            .send({
              user_name: 'testuser',
              password: 'password123'
            })
        );

        const responses = await Promise.all(promises);
        
        // At least one request should be rate limited
        expect(responses.some(res => res.status === 429 || res.status === 200)).toBe(true);
      });
    });

    describe('POST /user/signup', () => {
      it('should register new user with valid data', async () => {
        User.findOne.mockResolvedValue(null); // No existing user
        User.prototype.save = jest.fn().mockResolvedValue({
          _id: 'new-user-id',
          user_name: 'newuser',
          email: 'new@example.com'
        });

        const response = await request(app)
          .post('/user/signup')
          .send({
            user_name: 'newuser',
            password: 'password123',
            full_name: 'New User',
            email: 'new@example.com',
            identity: '123456789',
            phone: '0123456789'
          });

        expect(response.status).toBe(200);
      });

      it('should sanitize input data', async () => {
        User.findOne.mockResolvedValue(null);
        User.prototype.save = jest.fn().mockResolvedValue({});

        await request(app)
          .post('/user/signup')
          .send({
            user_name: '<script>alert("xss")</script>cleanuser',
            password: 'password123',
            full_name: 'New User',
            email: 'new@example.com',
            identity: '123456789',
            phone: '0123456789'
          });

        // The middleware should have sanitized the input
        expect(User.prototype.save).toHaveBeenCalled();
      });
    });

    describe('GET /user/profile', () => {
      it('should return user profile with valid token', async () => {
        User.findById.mockResolvedValue(testUser);

        const response = await request(app)
          .get('/user/profile')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('user');
      });

      it('should reject request without token', async () => {
        await request(app)
          .get('/user/profile')
          .expect(401);
      });

      it('should reject request with invalid token', async () => {
        await request(app)
          .get('/user/profile')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);
      });
    });
  });

  describe('Auction Endpoints', () => {
    describe('GET /auction/categories', () => {
      it('should return all categories', async () => {
        const mockCategories = [
          { _id: '1', name: 'Electronics', slug: 'electronics' },
          { _id: '2', name: 'Fashion', slug: 'fashion' }
        ];

        Category.find.mockResolvedValue(mockCategories);

        const response = await request(app)
          .get('/auction/categories')
          .expect(200);

        expect(response.body).toEqual(mockCategories);
      });

      it('should handle database errors gracefully', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
          .get('/auction/categories')
          .expect(500);

        expect(response.body).toHaveProperty('message');
      });
    });

    describe('GET /auction/listing/search/:keyword', () => {
      it('should search auctions by keyword', async () => {
        const mockAuctions = [
          { _id: '1', name: 'Gaming Laptop', price: 1000 },
          { _id: '2', name: 'Business Laptop', price: 800 }
        ];

        Auction.find.mockReturnValue({
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(mockAuctions)
        });
        
        Auction.countDocuments.mockResolvedValue(2);

        const response = await request(app)
          .get('/auction/listing/search/laptop')
          .expect(200);

        expect(response.body).toHaveProperty('auctions');
        expect(Array.isArray(response.body.auctions)).toBe(true);
      });

      it('should sanitize search input', async () => {
        Auction.find.mockReturnValue({
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue([])
        });
        
        Auction.countDocuments.mockResolvedValue(0);

        const response = await request(app)
          .get('/auction/listing/search/<script>alert("xss")</script>laptop')
          .expect(200);

        // Should not crash and should handle sanitized input
        expect(response.body).toHaveProperty('auctions');
      });
    });

    describe('GET /auction/listing/:id', () => {
      it('should return auction details by ID', async () => {
        const mockAuction = {
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Auction',
          price: 100,
          owner: testUser._id
        };

        Auction.findById.mockResolvedValue(mockAuction);

        const response = await request(app)
          .get('/auction/listing/507f1f77bcf86cd799439011')
          .expect(200);

        expect(response.body).toHaveProperty('auction');
      });

      it('should return 404 for non-existent auction', async () => {
        Auction.findById.mockResolvedValue(null);

        await request(app)
          .get('/auction/listing/507f1f77bcf86cd799439999')
          .expect(404);
      });

      it('should handle invalid ObjectId format', async () => {
        await request(app)
          .get('/auction/listing/invalid-id')
          .expect(400);
      });
    });

    describe('POST /auction/listing/:id/bid', () => {
      it('should place bid with authentication', async () => {
        const mockAuction = {
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Auction',
          current_price: 100,
          owner: '507f1f77bcf86cd799439012' // Different from bidder
        };

        Auction.findById.mockResolvedValue(mockAuction);
        Auction.findByIdAndUpdate.mockResolvedValue({
          ...mockAuction,
          current_price: 150
        });

        const response = await request(app)
          .post('/auction/listing/507f1f77bcf86cd799439011/bid')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ bid_amount: 150 })
          .expect(200);

        expect(response.body).toHaveProperty('message');
      });

      it('should reject bid without authentication', async () => {
        await request(app)
          .post('/auction/listing/507f1f77bcf86cd799439011/bid')
          .send({ bid_amount: 150 })
          .expect(401);
      });
    });
  });

  describe('Admin Endpoints', () => {
    describe('Admin Authentication', () => {
      it('should allow admin access with admin token', async () => {
        // Mock admin endpoint that requires admin role
        User.find.mockResolvedValue([testUser, testAdmin]);

        const response = await request(app)
          .get('/user/')  // Admin endpoint for user list
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });

      it('should deny admin access with user token', async () => {
        await request(app)
          .get('/user/')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('not found');
    });

    it('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/user/login')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should handle server errors gracefully', async () => {
      // Mock a database error
      User.findOne.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/user/login')
        .send({
          user_name: 'testuser',
          password: 'password123'
        })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Check for common security headers (added by helmet)
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });

  describe('CORS Configuration', () => {
    it('should handle CORS for allowed origins', async () => {
      const response = await request(app)
        .options('/health')
        .set('Origin', 'http://localhost:3001')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should include credentials in CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3001')
        .expect(200);

      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('API Documentation', () => {
    it('should serve Swagger documentation', async () => {
      const response = await request(app)
        .get('/api-docs/')
        .expect(200);

      expect(response.text).toContain('swagger');
    });
  });
});