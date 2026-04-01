import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Cancelled", "Returned"],
    },
    location: { type: String, default: "" },
    description: { type: String, default: "" },
    updatedBy: { type: String, default: "System" },
  },
  { timestamps: true }
);

const shipmentSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    // Sender Info
    senderName: { type: String, required: true, trim: true },
    senderAddress: { type: String, required: true, trim: true },
    senderCity: { type: String, required: true, trim: true },
    senderPhone: { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, trim: true, lowercase: true },

    // Receiver Info
    receiverName: { type: String, required: true, trim: true },
    receiverAddress: { type: String, required: true, trim: true },
    receiverCity: { type: String, required: true, trim: true },
    receiverPhone: { type: String, required: true, trim: true },
    receiverEmail: { type: String, required: true, trim: true, lowercase: true },

    // Package Info
    weight: { type: Number, required: true, min: 0.1 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    packageType: {
      type: String,
      enum: ["Document", "Parcel", "Fragile", "Perishable", "Electronics", "Other"],
      default: "Parcel",
    },
    description: { type: String, trim: true },
    declaredValue: { type: Number, default: 0 },

    // Status & Tracking
    currentStatus: {
      type: String,
      enum: ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Cancelled", "Returned"],
      default: "Pending",
    },
    currentLocation: { type: String, default: "" },
    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date },
    statusHistory: [statusHistorySchema],

    // Service
    serviceType: {
      type: String,
      enum: ["Standard", "Express", "Overnight", "Economy"],
      default: "Standard",
    },
    shippingCost: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
shipmentSchema.index({ trackingId: 1 });
shipmentSchema.index({ currentStatus: 1 });
shipmentSchema.index({ createdAt: -1 });

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
