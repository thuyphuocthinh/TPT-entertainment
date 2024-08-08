import { NextFunction, Request, Response } from "express";
import Users from "../../models/users.model";

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.cookies.tokenUser) {
      const tokenUser: string = req.cookies.tokenUser;
      const user = await Users.findOne({
        tokenUser: tokenUser,
        deleted: false,
      }).select("-password");
      if (user) {
        res.locals.user = user;
      }
    }
    res.locals.originalUrl = req.originalUrl;
    next();
  } catch (error) {
    console.log(error);
  }
};
