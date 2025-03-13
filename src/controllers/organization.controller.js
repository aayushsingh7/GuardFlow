import OrganizationService from "../services/organization.service.js";

class OrganizationControllers {
  constructor() {
    this.orgService = new OrganizationService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.authenticateOrg = this.authenticateOrg.bind(this);
    this.logout = this.logout.bind(this);
  }

  async register(req, res) {
    try {
      let { org, token } = await this.orgService.register(req.body);
      resres
        .cookie("earnmore", token, {
          sameSite: "none",
          httpOnly: true,
          secure: false,
          maxAge: 15 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .send({
          success: true,
          message: "Organization registered successfully",
          org: org,
          token,
        });
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message });
    }
  }

  async login(req, res) {
    try {
      let { org, token } = await this.orgService.login(req.body);
      res
        .cookie("earnmore", token, {
          sameSite: "none",
          httpOnly: true,
          secure: false,
          maxAge: 15 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .send({
          success: true,
          message: "Organization logged in successfully",
          org: org,
          token,
        });
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("earnmore");
      res
        .status(200)
        .send({ success: true, message: "User logged out successfully" });
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message });
    }
  }

  async authenticateOrg(req, res) {
    try {
      let { org } = await this.orgService.authenticateOrg(req.org._id);
      res.status(200).send({
        success: true,
        message: "Organization is logged in",
        org,
      });
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message });
    }
  }
}

export default OrganizationControllers;
