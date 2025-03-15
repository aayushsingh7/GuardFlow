import Report from "../models/report.model.js";

class ReportService {
  async saveScanReport(report) {
    try {
      let newReport = new Report(report);
      await newReport.save();
      return newReport;
    } catch (err) {
      throw err;
    }
  }
  async getScanReport(query) {
    const { startTime, endTime, organizationID } = query;
    let start = new Date(startTime);
    let end = new Date(endTime);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);
    try {
      const latestReport = await Report.findOne({
        organization: organizationID,
        createdAt: { $gte: start, $lte: end },
      });
      return latestReport;
    } catch (err) {
      throw err;
    }
  }

  async getScanReports(query) {
    const { startTime, endTime, organizationID } = query;
    let start = new Date(startTime);
    let end = new Date(endTime);

    try {
      const latestReport = await Report.find({
        organization: organizationID,
        createdAt: { $gte: start, $lte: end },
      }).sort({ createdAt: -1 }); // Sort by latest first

      return latestReport;
    } catch (err) {
      throw err;
    }
  }
}

export default ReportService;
