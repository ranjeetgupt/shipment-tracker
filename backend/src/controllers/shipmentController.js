import Shipment from "../models/Shipment.js";
import { generateTrackingId, getEstimatedDelivery } from "../utils/generateTrackingId.js";


export const createShipment = async (req, res, next) => {
  try {
    const {
      senderName, senderAddress, senderCity, senderPhone, senderEmail,
      receiverName, receiverAddress, receiverCity, receiverPhone, receiverEmail,
      weight, dimensions, packageType, description, declaredValue,
      serviceType, shippingCost,
    } = req.body;

    const trackingId = generateTrackingId();
    const estimatedDelivery = getEstimatedDelivery(serviceType);

    const shipment = await Shipment.create({
      trackingId,
      senderName, senderAddress, senderCity, senderPhone, senderEmail,
      receiverName, receiverAddress, receiverCity, receiverPhone, receiverEmail,
      weight, dimensions, packageType, description, declaredValue,
      serviceType, shippingCost,
      estimatedDelivery,
      currentStatus: "Pending",
      statusHistory: [
        {
          status: "Pending",
          location: senderCity,
          description: "Shipment created and awaiting pickup",
          updatedBy: "System",
        },
      ],
    });

    res.status(201).json({ success: true, data: shipment });
  } catch (error) {
    next(error);
  }
};


export const getAllShipments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (status && status !== "all") query.currentStatus = status;
    if (search) {
      query.$or = [
        { trackingId: { $regex: search, $options: "i" } },
        { senderName: { $regex: search, $options: "i" } },
        { receiverName: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Shipment.countDocuments(query);
    const shipments = await Shipment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-statusHistory")
      .lean();

    res.json({
      success: true,
      data: shipments,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const trackShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({
      trackingId: req.params.trackingId.toUpperCase(),
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: `No shipment found with tracking ID: ${req.params.trackingId}`,
      });
    }

    res.json({ success: true, data: shipment });
  } catch (error) {
    next(error);
  }
};

export const getShipmentById = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }
    res.json({ success: true, data: shipment });
  } catch (error) {
    next(error);
  }
};

export const updateShipmentStatus = async (req, res, next) => {
  try {
    const { status, location, description, updatedBy } = req.body;

    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    shipment.currentStatus = status;
    shipment.currentLocation = location || shipment.currentLocation;

    if (status === "Delivered") {
      shipment.actualDelivery = new Date();
    }

    shipment.statusHistory.push({
      status,
      location: location || "",
      description: description || `Status updated to ${status}`,
      updatedBy: updatedBy || "Admin",
    });

    await shipment.save();
    res.json({ success: true, data: shipment });
  } catch (error) {
    next(error);
  }
};

export const deleteShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }
    res.json({ success: true, message: "Shipment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (_req, res, next) => {
  try {
    const [statusCounts, recentShipments, totalCount] = await Promise.all([
      Shipment.aggregate([
        { $group: { _id: "$currentStatus", count: { $sum: 1 } } },
      ]),
      Shipment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("trackingId senderName receiverName currentStatus createdAt")
        .lean(),
      Shipment.countDocuments(),
    ]);

    const stats = {
      total: totalCount,
      byStatus: statusCounts.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {}),
      recentShipments,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
