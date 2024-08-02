import { Request, Response } from "express";

export const index = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/users/index", {
      pageTitle: "Quản lí người dùng",
    });
  } catch (error) {
    console.log(error);
  }
};
