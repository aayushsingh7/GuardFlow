import ApiTrafficService from "../services/apiTraffic.service.js";

class ApiTrafficController {
  constructor() {
    this.apiTrafficService = new ApiTrafficService();
    this.getTrafficOverivew = this.getTrafficOverivew.bind(this);
    this.getHourTraffic = this.getHourTraffic.bind(this);
    this.getRoutesTraffic = this.getRoutesTraffic.bind(this);
    this.getRouteTraffic = this.getRouteTraffic.bind(this);
    this.addTraffic = this.addTraffic.bind(this);
  }

  async addTraffic(req, res) {
    try {
      let response = await this.apiTrafficService.addTraffic(req.body);
      res.status(201).send({
        success: true,
        message: "New traffic data inserted successfully",
        data: response,
      });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  }
  async getTrafficOverivew(req, res) {
    try {
      let response = await this.apiTrafficService.getTrafficOverview(req.query);
      res.status(200).send({
        success: true,
        message: "Traffic data fetched successfully",
        data: response,
        startTime: req.query.startTime,
        endTime: req.query.endTimes,
      });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  }
  async getHourTraffic(req, res) {
    try {
      let response = await this.apiTrafficService.getHourTraffic(req.query);
      res.status(200).send({
        success: true,
        message: "Hour traffic fetched successfully",
        data: response,
        startTime: req.query.startTime,
        endTime: req.query.endTimes,
      });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  }
  async getRoutesTraffic(req, res) {
    try {
      let response = await this.apiTrafficService.getRoutesTraffic(req.query);
      res.status(200).send({
        success: true,
        message: "Routes traffic data fetched successfully",
        data: response,
        startTime: req.query.startTime,
        endTime: req.query.endTimes,
      });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  }
  async getRouteTraffic(req, res) {
    try {
      let response = await this.apiTrafficService.getRouteTraffic(req.query);
      res.status(200).send({
        success: true,
        message: "Route traffic data fetched successfully",
        data: response,
        startTime: req.query.startTime,
        endTime: req.query.endTimes,
      });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  }
}

export default ApiTrafficController;
