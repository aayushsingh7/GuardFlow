import { Schema, model } from "mongoose";

const organizationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, trim: true },
    sysConfigs: {},
  },
  { timestamps: true }
);

const Organization = model("Organization", organizationSchema);

export default Organization;
