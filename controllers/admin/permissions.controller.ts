import { Request, Response } from "express";
import Roles from "../../models/roles.model";

export const index = async (req: Request, res: Response) => {
  try {
    const roles = await Roles.find({ deleted: false });
    res.render("admin/pages/permissions/index", {
      pageTitle: "Bảng phân quyền",
      roles,
    });
  } catch (error) {
    console.log(error);
  }
};

export const patchEdit = async (req: Request, res: Response) => {
  try {
    const permissions = JSON.parse(req.body.permissionsUpdate);
    for (const permission of permissions) {
      await Roles.updateOne(
        {
          _id: permission.role_id,
        },
        {
          permissions: permission.permissions,
        }
      );
    }
    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
