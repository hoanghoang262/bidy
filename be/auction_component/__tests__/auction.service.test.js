const mongoose = require('mongoose');

// Mock all dependencies
jest.mock('../models/bid.model');
jest.mock('../models/cart.model');
jest.mock('../models/category.model');
jest.mock('../models/order.model');
jest.mock('../../user_components/models/user.model');
jest.mock('../../user_components/models/wishlist.model');
jest.mock('aws-sdk');
jest.mock('nodemailer');
jest.mock('../../util/cache');

const Auction = require('../models/bid.model');
const Cart = require('../models/cart.model');
const Category = require('../models/category.model');
const Order = require('../models/order.model');
const User = require('../../user_components/models/user.model');
const { cache, CACHE_KEYS, CACHE_TTL } = require('../../util/cache');

// Import service under test
const auctionService = require('../auction.service');

describe('Auction Service - Core Business Logic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup environment variables for testing
    process.env.SERVER_URL = 'http://localhost:8001';
    process.env.BUCKET_NAME = 'test-bucket';
    process.env.ACCESS_KEY_ID = 'test-access-key';
    process.env.SECRET_ACCESS_KEY = 'test-secret-key';
  });

  describe('getAllCategory', () => {
    it('should return cached categories when available', async () => {
      const mockCategories = [
        { _id: '1', name: 'Electronics', slug: 'electronics' },
        { _id: '2', name: 'Fashion', slug: 'fashion' }
      ];

      cache.get.mockReturnValue(mockCategories);

      const result = await auctionService.getAllCategory();

      expect(cache.get).toHaveBeenCalledWith(CACHE_KEYS.CATEGORIES);
      expect(Category.find).not.toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });

    it('should fetch from database and cache when not in cache', async () => {
      const mockCategories = [
        { _id: '1', name: 'Electronics', slug: 'electronics' },
        { _id: '2', name: 'Fashion', slug: 'fashion' }
      ];

      cache.get.mockReturnValue(null);
      Category.find.mockResolvedValue(mockCategories);

      const result = await auctionService.getAllCategory();

      expect(cache.get).toHaveBeenCalledWith(CACHE_KEYS.CATEGORIES);
      expect(Category.find).toHaveBeenCalled();
      expect(cache.set).toHaveBeenCalledWith(
        CACHE_KEYS.CATEGORIES, 
        mockCategories, 
        CACHE_TTL.CATEGORIES
      );
      expect(result).toEqual(mockCategories);
    });

    it('should handle database errors gracefully', async () => {
      cache.get.mockReturnValue(null);
      Category.find.mockRejectedValue(new Error('Database connection failed'));

      await expect(auctionService.getAllCategory()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getProductBySearch', () => {
    it('should search products with keyword and pagination', async () => {
      const keyword = 'laptop';
      const pageNumber = 1;
      const limitNumber = 10;
      const mockAuctions = [
        { _id: '1', name: 'Gaming Laptop', price: 1000 },
        { _id: '2', name: 'Business Laptop', price: 800 }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockAuctions)
      };
      
      Auction.find.mockReturnValue(mockQuery);
      Auction.countDocuments.mockResolvedValue(25);

      const result = await auctionService.getProductBySearch(keyword, pageNumber, limitNumber);

      expect(result.auction).toEqual(mockAuctions);
      expect(result.totalAuctions).toBe(25);
      expect(result.totalPages).toBe(3); // Math.ceil(25/10)
    });

    it('should handle empty search results', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };
      
      Auction.find.mockReturnValue(mockQuery);
      Auction.countDocuments.mockResolvedValue(0);

      const result = await auctionService.getProductBySearch('nonexistent', 1, 10);

      expect(result.auction).toEqual([]);
      expect(result.totalPages).toBe(0);
    });

    it('should calculate correct pagination for different page sizes', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };
      
      Auction.find.mockReturnValue(mockQuery);
      Auction.countDocuments.mockResolvedValue(97);

      // Test with page size 15
      const result = await auctionService.getProductBySearch('test', 2, 15);
      
      expect(result.totalPages).toBe(7); // Math.ceil(97/15)
    });
  });

  // Note: getTotal is an internal helper function, not exported

  describe('getTotalOrder utility function', () => {
    it('should calculate total orders for user correctly', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const limitNumber = 10;

      Order.find.mockReturnValue({
        countDocuments: jest.fn().mockResolvedValue(23)
      });

      const result = await auctionService.getTotalOrder(userId, limitNumber);

      expect(Order.find).toHaveBeenCalledWith({ user_id: userId });
      expect(result.totalOrder).toBe(23);
      expect(result.totalPages).toBe(3); // Math.ceil(23/10)
    });
  });

  describe('getTotalAuction utility function', () => {
    it('should calculate total auctions for owner correctly', async () => {
      const ownerId = '507f1f77bcf86cd799439011';
      const limitNumber = 8;

      Auction.find.mockReturnValue({
        countDocuments: jest.fn().mockResolvedValue(17)
      });

      const result = await auctionService.getTotalAuction(ownerId, limitNumber);

      expect(Auction.find).toHaveBeenCalledWith({ owner: ownerId });
      expect(result.totalAuction).toBe(17);
      expect(result.totalPages).toBe(3); // Math.ceil(17/8)
    });
  });
});

describe('Auction Service - Business Logic Validation Tests', () => {
  describe('Input validation', () => {
    it('should handle invalid pagination parameters', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };
      
      Auction.find.mockReturnValue(mockQuery);
      Auction.countDocuments.mockResolvedValue(0);
      
      // Test negative page numbers
      const result = await auctionService.getProductBySearch('test', -1, 10);
      expect(result).toBeDefined();
    });

    it('should handle zero or negative limit numbers', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };
      
      Auction.find.mockReturnValue(mockQuery);
      Auction.countDocuments.mockResolvedValue(0);

      const result = await auctionService.getProductBySearch('test', 1, 0);
      expect(result).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should handle mongoose connection errors', async () => {
      Category.find.mockRejectedValue(new mongoose.Error('Connection timeout'));

      cache.get.mockReturnValue(null);

      await expect(auctionService.getAllCategory()).rejects.toThrow();
    });

    it('should handle malformed queries', async () => {
      Auction.find.mockImplementation(() => {
        throw new Error('Invalid query format');
      });

      await expect(
        auctionService.getProductBySearch('test', 1, 10)
      ).rejects.toThrow('Invalid query format');
    });
  });
});

describe('Auction Service - Cache Integration Tests', () => {
  it('should implement proper cache invalidation strategy', async () => {
    // Reset mocks to ensure clean state for this test
    jest.clearAllMocks();
    
    // Simulate cache miss first time
    cache.get.mockReturnValueOnce(null);
    Category.find.mockResolvedValue([{ name: 'Electronics' }]);

    await auctionService.getAllCategory();

    // Verify cache was set
    expect(cache.set).toHaveBeenCalledWith(
      CACHE_KEYS.CATEGORIES,
      [{ name: 'Electronics' }],
      CACHE_TTL.CATEGORIES
    );

    // Simulate cache hit second time
    cache.get.mockReturnValueOnce([{ name: 'Electronics' }]);

    const result = await auctionService.getAllCategory();
    
    // Verify database wasn't called second time
    expect(Category.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ name: 'Electronics' }]);
  });
});