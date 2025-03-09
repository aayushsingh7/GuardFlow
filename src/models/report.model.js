import { Schema, model } from "mongoose";

const VulnerabilitySchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    required: true,
  },
  packageName: { type: String, required: true },
  version: { type: String, required: true },
  fixedIn: { type: [String], default: [] },
});

const ReportSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "organization" },
    vulnerabilitiesCount: { type: Number, required: true },
    summary: { type: String, required: true },
    packageName: { type: String, default: "" },
    vulnerabilities: { type: [VulnerabilitySchema], default: [] },
  },
  { timestamps: true }
);

const Report = model("Report", ReportSchema);

export default Report;
