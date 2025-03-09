import mongoose from "mongoose";

const apiTrafficSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    hour: { type: Number, required: true, min: 0, max: 23 },
    totalRequests: { type: Number, default: 0 },
    breakdown: {
      type: Map,
      of: Number,
      default: {},
    },
    trafficPerRoutes: {
      type: Map,
      of: new mongoose.Schema(
        {
          totalRequest: { type: Number, required: true },
          GET: { type: Number, required: true },
          POST: { type: Number, required: true },
          DELETE: { type: Number, required: true },
          PUT: { type: Number, required: true },
        },
        { _id: false }
      ), // Prevents creating an extra _id field inside each object
    },
  },
  { timestamps: true }
);

const ApiTraffic = mongoose.model("ApiTraffic", apiTrafficSchema);

export default ApiTraffic;
