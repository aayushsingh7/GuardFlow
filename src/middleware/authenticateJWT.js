import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.guardflow;

  if (!token) {
    return res.status(403).send({ success: false, message: "Access denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.org = decoded;
    next();
  } catch (err) {
    res
      .status(401)
      .send({ success: false, message: "Invalid or expired token." });
  }
};

export default authenticateJWT;
