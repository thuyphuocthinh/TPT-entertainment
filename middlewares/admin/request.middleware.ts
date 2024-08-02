import { NextFunction, Request, Response } from "express";
import { systemConfig } from "../../config/system.config";

export const getReq = (route: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = res.locals.role;
    const permissions = role.permissions.join(",");
    if (
      permissions.includes(`${route}-view`) ||
      permissions.includes(`${route}-edit`) ||
      permissions.includes(`${route}-create`) ||
      permissions.includes(`${route}-delete`)
    ) {
      next();
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/errors/unauthorized`);
    }
  };
};

export const postReq = (route: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = res.locals.role;
    const permissions = role.permissions.join(",");
    if (permissions.includes(`${route}-create`)) {
      next();
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/errors/unauthorized`);
    }
  };
};

export const patchReq = (route: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = res.locals.role;
    const permissions = role.permissions.join(",");
    if (permissions.includes(`${route}-edit`)) {
      next();
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/errors/unauthorized`);
    }
  };
};

export const deleteReq = (route: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = res.locals.role;
    const permissions = role.permissions.join(",");
    if (permissions.includes(`${route}-delete`)) {
      next();
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/errors/unauthorized`);
    }
  };
};
