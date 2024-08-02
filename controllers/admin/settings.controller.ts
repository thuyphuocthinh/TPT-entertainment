import { Request, Response } from "express";
import Settings from "../../models/settings.model";

export const index = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne({ deleted: false });
    res.render("admin/pages/settings/index", {
      pageTitle: "Cài đặt chung",
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

export const patchEdit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const data = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      email: req.body.email,
    };
    if (req.body.image) {
      data["image"] = req.body.image;
    }
    await Settings.updateOne({ _id: id }, data);
    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
