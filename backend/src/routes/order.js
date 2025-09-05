const express = require("express");
const router = express.Router();
const {
  newOrder,
  getAdminOrders,
  getSingleOrder,
  proccessOrder,
  getMyOrders,
  getVendorOrders,
  confirmVendorOrder,
  chooseDeliveryAgent,
  updateDeliveryStatus,
} = require("../controller/order");

const { authenticateUser, authorizeRoles } = require("../middleware/auth");

router.post("/create", authenticateUser, newOrder);

router.put(
  "/update/:_id",
  authenticateUser,
  authorizeRoles("admin"),
  proccessOrder
);

router.get("/:_id", authenticateUser, getSingleOrder);
router.get("/my", authenticateUser, getMyOrders);
router.get("/admin", authenticateUser, authorizeRoles("admin"), getAdminOrders);

// Farmer routes
router.get(
  "/farmer",
  authenticateUser,
  authorizeRoles("farmer"),
  getVendorOrders
);
router.put(
  "/farmer/:id/confirm",
  authenticateUser,
  authorizeRoles("farmer"),
  confirmVendorOrder
);
router.put(
  "/farmer/:id/choose-delivery-agent",
  authenticateUser,
  authorizeRoles("farmer"),
  chooseDeliveryAgent
);
router.put(
  "/farmer/:id/delivery",
  authenticateUser,
  authorizeRoles("farmer"),
  updateDeliveryStatus
);

// Delivery agent routes
router.put(
  "/delivery-agent/:id/delivery",
  authenticateUser,
  authorizeRoles("delivery_agent"),
  updateDeliveryStatus
);

module.exports = router;
