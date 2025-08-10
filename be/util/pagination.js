/**
 * Centralized pagination utility
 * Eliminates repetitive pagination logic across services
 */

/**
 * Generic pagination calculator
 * @param {Object} model - Mongoose model
 * @param {Object} query - Search query
 * @param {number} limitNumber - Items per page
 * @returns {Object} Total count and pages
 */
const getPagination = async (model, query, limitNumber) => {
  const totalCount = await model.find(query).countDocuments();
  const totalPages = Math.ceil(totalCount / limitNumber);
  return { totalCount, totalPages };
};

/**
 * Calculate pagination metadata
 * @param {number} totalCount - Total items
 * @param {number} pageNumber - Current page
 * @param {number} limitNumber - Items per page
 * @returns {Object} Pagination metadata
 */
const getPaginationMeta = (totalCount, pageNumber, limitNumber) => {
  const totalPages = Math.ceil(totalCount / limitNumber);
  return {
    totalCount,
    totalPages,
    currentPage: totalPages ? pageNumber : 0,
    hasNext: pageNumber < totalPages,
    hasPrev: pageNumber > 1
  };
};

/**
 * Generic filtered and paginated data retrieval
 * Consolidates common filtering, pagination, and population patterns
 */
const getFilteredPaginatedData = async ({
  model,                    // Mongoose model
  filter = {},             // Filter criteria object
  pageNumber = 1,          // Page number (1-based)
  limitNumber = 15,        // Items per page
  populate = [],           // Population options array
  sort = { createdAt: -1 }, // Sort criteria (default: newest first)
  lean = true,             // Use lean() for better performance
  searchFields = [],       // Fields to search in ['name', 'description']
  searchTerm = null,       // Search term for regex matching
  searchOptions = 'i',     // Regex options (case insensitive)
  responseKeys = {         // Customize response field names
    data: 'data',
    total: 'total',
    totalPages: 'totalPages',
    currentPage: 'currentPage'
  }
}) => {
  // Build final filter with search functionality
  let finalFilter = { ...filter };
  
  if (searchTerm && searchFields.length > 0) {
    const searchConditions = searchFields.map(field => ({
      [field]: { $regex: searchTerm, $options: searchOptions }
    }));
    finalFilter = {
      ...finalFilter,
      $or: searchConditions
    };
  }

  const skip = (pageNumber - 1) * limitNumber;

  // Execute parallel queries for data and count
  const [data, totalCount] = await Promise.all([
    model.find(finalFilter)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber)
      .populate(populate)
      .lean(lean),
    model.countDocuments(finalFilter)
  ]);

  const totalPages = Math.ceil(totalCount / limitNumber);

  return {
    [responseKeys.data]: data,
    [responseKeys.total]: totalCount,
    [responseKeys.totalPages]: totalPages,
    [responseKeys.currentPage]: totalPages ? pageNumber : 0,
  };
};

module.exports = {
  getPagination,
  getPaginationMeta,
  getFilteredPaginatedData
};