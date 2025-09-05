// utils/parseFormData.js
/**
 * Safely parse form data fields that might come as JSON strings or objects
 * This handles the case where mobile apps send objects directly while web forms send JSON strings
 */

/**
 * Parse a field that might be a JSON string or already an object
 * @param {any} field - The field to parse
 * @param {any} defaultValue - Default value if field is null/undefined
 * @returns {any} - Parsed object or the original value
 */
const safeParseField = (field, defaultValue = null) => {
  if (field === null || field === undefined) {
    return defaultValue;
  }
  
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (error) {
      console.warn('Failed to parse JSON field:', field, error.message);
      return defaultValue;
    }
  }
  
  // If it's already an object/array, return as is
  return field;
};

/**
 * Parse multiple form data fields safely
 * @param {Object} reqBody - The request body object
 * @param {Object} fieldMappings - Object mapping field names to default values
 * @returns {Object} - Updated request body with parsed fields
 */
const parseFormDataFields = (reqBody, fieldMappings = {}) => {
  const parsedBody = { ...reqBody };
  
  Object.entries(fieldMappings).forEach(([fieldName, defaultValue]) => {
    if (parsedBody[fieldName] !== undefined) {
      parsedBody[fieldName] = safeParseField(parsedBody[fieldName], defaultValue);
    }
  });
  
  return parsedBody;
};

/**
 * Common field mappings for different registration types
 */
const COMMON_FIELDS = {
  contactInfo: [],
  paymentMethods: [],
  address: {},
  businessAddress: {},
  farmAddress: {},
  deliveryPreferences: {},
  operatingHours: [],
  farmSize: {},
  shipping: {}
};

module.exports = {
  safeParseField,
  parseFormDataFields,
  COMMON_FIELDS
};
