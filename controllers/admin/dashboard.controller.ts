import { Request, Response } from "express";

export const index = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/dashboard/index", {
      pageTitle: "Dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};
