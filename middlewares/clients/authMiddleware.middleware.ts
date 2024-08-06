import { NextFunction, Request, Response } from "express";
import Users from "../../models/users.model";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.headers.authorization) {
      const tokenUser = req.headers.authorization.split(" ")[1];
      const user = await Users.findOne({
        tokenUser: tokenUser,
        deleted: false,
      }).select("-password");
      if (user) {
        next();
      } else {
        res.json({
          status: 400,
          data: "Invalid token",
        });
        return;
      }
    } else {
      res.json({
        status: 400,
        data: "Invalid token",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
