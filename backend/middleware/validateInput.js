
const { body, param, validationResult } = require('express-validator');

// Error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for PED details
const validatePedDetail = [
  body('transaction_id').notEmpty().withMessage('Transaction ID is required'),
  body('document_type').notEmpty().withMessage('Document type is required'),
  body('country').notEmpty().withMessage('Country is required'),
  handleValidationErrors
];

// Validation rules for search sessions
const validateSearchSession = [
  body('transaction_id').notEmpty().withMessage('Transaction ID is required'),
  body('search_country').notEmpty().withMessage('Search country is required'),
  body('search_document_type').notEmpty().withMessage('Search document type is required'),
  handleValidationErrors
];

// Validation rules for source URLs
const validateSourceUrl = [
  body('transaction_id').notEmpty().withMessage('Transaction ID is required'),
  body('image_url').notEmpty().isURL().withMessage('Valid image URL is required'),
  body('page_url').notEmpty().isURL().withMessage('Valid page URL is required'),
  handleValidationErrors
];

// Validation rules for collector queries
const validateCollectorQuery = [
  body('query_text').notEmpty().withMessage('Query text is required'),
  body('target_country').notEmpty().withMessage('Target country is required'),
  body('target_document_type').notEmpty().withMessage('Target document type is required'),
  handleValidationErrors
];

// Validation for ID parameter
const validateIdParam = [
  param('id').isInt().withMessage('ID must be an integer'),
  handleValidationErrors
];

module.exports = {
  validatePedDetail,
  validateSearchSession,
  validateSourceUrl,
  validateCollectorQuery,
  validateIdParam
};
