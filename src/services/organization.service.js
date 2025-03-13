import Organization from "../models/organization.model.js";
import CustomError from "../utils/customError.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  let hashedPassword = await bcryptjs.hash(plainPassword, saltRounds);
  return hashedPassword;
};

const generateJWTToken = (userID) => {
  const token = jwt.sign({ _id: userID }, process.env.SECRET_KEY, {
    expiresIn: "15d",
  });
  return token;
};

class OrganizationService {
  constructor() {}

  async register(body) {
    const { name, email, password, location } = body;
    try {
      let isEmailExists = await Organization.findOne({ email });
      if (isEmailExists) {
        throw new CustomError(
          "Organization already exists with the given email",
          400
        );
      }

      let hashedPassword = await hashPassword(password);
      let newOrg = new Organization({
        email,
        password: hashedPassword,
        location,
        name,
      });

      const org = await newOrg.save();
      let token = generateJWTToken(newOrg._id);
      return { org, token };
    } catch (err) {
      console.log("errror", err);
      throw err;
    }
  }

  async login(body) {
    const { email, password } = body;
    try {
      let org = await Organization.findOne({ email });
      if (!org) {
        throw new CustomError(
          "No organization found with the given email",
          404
        );
      }

      let isValidPassword = await bcryptjs.compare(password, org.password);
      if (isValidPassword) {
        let token = generateJWTToken(org._id);
        return {
          success: true,
          message: "Organization logged in successfully",
          org,
          token,
        };
      } else {
        throw new CustomError("Invalid Password", 401);
      }
    } catch (err) {
      throw err;
    }
  }

  async authenticateOrg(org_id) {
    try {
      let org = await Organization.findOne({ _id: org_id });
      if (!org) {
        throw new CustomError("Invalid Token! No Organization Found", 404);
      }
      return {
        success: true,
        message: "Organization is logged in",
        org,
      };
    } catch (err) {
      throw err;
    }
  }
}

export default OrganizationService;
