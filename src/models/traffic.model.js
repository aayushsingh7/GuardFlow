import { Schema, model } from "mongoose";

const trafficSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    parentRoute: { type: String, required: true },
    subRoute: { type: String, required: true },
    hitCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["OK", "MODERATE", "HIGH", "CRITICAL"],
      default: "OK",
    },
  },
  { timestamps: true }
);

const Traffic = model("Traffic", trafficSchema);

export default Traffic;
