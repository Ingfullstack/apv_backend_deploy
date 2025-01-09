import jwt from "jsonwebtoken";
import { Veterinario } from "../models/Veterinario.js";

export const checkAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.veterinario = await Veterinario.findById(decoded.id).select(
        "-confirmado -token -password"
      );
      return next();
    } catch (e) {
      const error = new Error("Token No Valido");
      return res.status(401).json({ msg: error.message });
    }
  }
  if (!token) {
    const error = new Error("Token No Valido o inexistente");
    return res.status(401).json({ msg: error.message });
  }
  return next();
};
