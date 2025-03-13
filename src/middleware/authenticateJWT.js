import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.earnmore;

  if (!token) {
    return res.status(403).send({ success: false, message: "Access denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decoded);
    req.org = decoded;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .send({ success: false, message: "Invalid or expired token." });
  }
};

export default authenticateJWT;
