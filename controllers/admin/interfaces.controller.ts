import { Request, Response } from "express";
import { systemConfig } from "../../config/system.config";
import Carousels from "../../models/carousels.model";

export const index = async (req: Request, res: Response) => {
  try {
    const carousels = await Carousels.find({ deleted: false });
    res.render("admin/pages/interfaces/carousels/index", {
      pageTitle: "Quản lí carousels",
      carousels,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCreate = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/interfaces/carousels/create", {
      pageTitle: "Thêm mới carousel",
    });
  } catch (error) {
    console.log(error);
  }
};

export const postCreate = async (req: Request, res: Response) => {
  try {
    const image: string = req.body.image;
    const record = new Carousels({ image });
    await record.save();
    req.flash("success", "Thêm mới carousel thành công");
    res.redirect(`${systemConfig.prefixAdmin}/interfaces/carousels`);
  } catch (error) {
    console.log(error);
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Carousels.updateOne({ _id: id, deleted: false }, { deleted: true });
    req.flash("success", "Xóa thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
