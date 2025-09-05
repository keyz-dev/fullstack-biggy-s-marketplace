const ApplicationService = require("../../services/applicationService");
const { BadRequestError } = require("../../utils/errors");
const wrapAsync = require("../../error_handler/AsyncError");
const { formatUserDataForAuth } = require("../../utils/returnFormats/userData");
const {
  initiateRegistrationSchema,
} = require("../../validation/userValidation");

// ==================== INITIATE REGISTRATION CONTROLLER ====================

/**
 * Initiate farmer application process
 * This creates a user account and starts the farmer application
 */
exports.initiateRegistration = wrapAsync(async (req, res, next) => {
  const { role } = req.params;
  const userRole = role.toLowerCase();

  if (!userRole || (userRole !== "farmer" && userRole !== "delivery_agent")) {
    throw new BadRequestError(
      "Invalid role. Must be 'farmer' or 'delivery_agent'"
    );
  }
  try {
    // Handle file uploads for avatar only
    let avatar = null;
    if (req.file) {
      avatar = req.file.path;
    }

    if (req.body.address) {
      // Handle address data - it might come as an object or JSON string
      if (typeof req.body.address === 'string') {
        req.body.address = JSON.parse(req.body.address);
      }
      // If it's already an object, no need to parse
    }

    const { error } = initiateRegistrationSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    // Then, initiate the farmer application
    const result = await ApplicationService.initiateRegistration(
      req.body,
      avatar,
      userRole
    );

    // Format response based on role
    const formattedResponse = formatUserDataForAuth(result.user);

    res.status(201).json({
      success: true,
      data: formattedResponse
    });
  } catch (error) {
    next(error);
  }
});
