import { Schema, model } from "mongoose";

const organizationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, trim: true },
    sysConfigs: {},
    location: { type: String },
  },
  { timestamps: true }
);

const Organization = model("Organization", organizationSchema);

export default Organization;
