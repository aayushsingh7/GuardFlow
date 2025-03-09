import ReportService from "../services/report.service.js";

class ReportController {
  constructor() {
    this.reportService = new ReportService();
    this.addScanReport = this.addScanReport.bind(this);
    this.getScanReport = this.getScanReport.bind(this);
    this.getScanReports = this.getScanReports.bind(this);
  }

  async addScanReport(req, res) {
    try {
      let addNewData = await this.reportService.saveScanReport(req.body);
      res
        .status(200)
        .send({ success: true, message: "Scan results uploaded successfully" });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  }

  async getScanReport(req, res) {
    try {
      let results = await this.reportService.getScanReport(req.query);
      res.status(200).send({
        success: true,
        message: "Report fetched successfully",
        startTime: req.query.startTime,
        endTime: req.query.endTime,
        data: results,
      });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  }

  async getScanReports(req, res) {
    try {
      let results = await this.reportService.getScanReports(req.query);
      res.status(200).send({
        success: true,
        message: "Reports fetched successfully",
        startTime: req.query.startTime,
        endTime: req.query.endTime,
        data: results,
      });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  }
}

export default ReportController;
