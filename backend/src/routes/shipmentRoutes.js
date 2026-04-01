import express from "express";
import {
  createShipment,
  getAllShipments,
  trackShipment,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment,
  getDashboardStats,
} from "../controllers/shipmentController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);

router.get("/track/:trackingId", trackShipment);

router.route("/").get(getAllShipments).post(createShipment);
router.route("/:id").get(getShipmentById).delete(deleteShipment);
router.patch("/:id/status", updateShipmentStatus);

export default router;
