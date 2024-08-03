import { Request, Response } from "express";
import Carousels from "../../models/carousels.model";

export const index = async (req: Request, res: Response) => {
  try {
    const carousels = await Carousels.find({ deleted: false });
    res.render("clients/pages/homepage/index", {
      pageTitle: "Trang chủ",
      carousels,
    });
  } catch (error) {
    console.log(error);
  }
};
