import { NextFunction, Request, Response } from "express";
import { systemConfig } from "../../config/system.config";
import Accounts from "../../models/accounts.model";
import Roles from "../../models/roles.model";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.cookies.token) {
      const token: string = req.cookies.token;
      const user = await Accounts.findOne({
        token: token,
        deleted: false,
      }).select("-password");
      if (user) {
        const role = await Roles.findOne({ _id: user.roleId, deleted: false });
        res.locals.role = role;
        res.locals.user = user;
        next();
      } else {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
      }
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
  } catch (error) {
    console.log(error);
  }
};
