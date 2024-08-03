import { Request, Response } from "express";
import { systemConfig } from "../../config/system.config";
import Accounts from "../../models/accounts.model";
import md5 from "md5";

export const getLogin = async (req: Request, res: Response) => {
  try {
    if (req.cookies.token) {
      const checkToken = await Accounts.findOne({
        token: req.cookies.token,
        deleted: false,
      });
      if (checkToken) {
        return res.redirect(`${systemConfig.prefixAdmin}/singers`);
      }
    }
    res.render("admin/pages/auth/login", {
      pageTitle: "Đăng nhập",
    });
  } catch (error) {
    console.error("Error during login:", error);
  }
};

export const postLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const checkEmail = await Accounts.findOne({ email: email });
    if (!checkEmail) {
      req.flash("error", "Email không tồn tại");
      res.redirect("back");
      return;
    }

    if (md5(password) !== checkEmail.password) {
      req.flash("error", "Sai mật khẩu");
      res.render("admin/pages/auth/login", {
        pageTitle: "Đăng nhập",
        email,
      });
      return;
    }

    if (checkEmail.status === "inactive") {
      req.flash(
        "error",
        "Tài khoản hiện đang bị khóa. Vui lòng liên admin để mở khóa."
      );
      res.redirect("back");
      return;
    }

    req.flash("success", "Đăng nhập thành công");
    res.cookie("token", checkEmail.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } catch (error) {
    console.log(error);
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    if (req.cookies.token) {
      res.clearCookie("token");
      req.flash("success", "Đăng xuất thành công");
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
  } catch (error) {
    console.log(error);
  }
};
   

/*
  1. AuthRoutes => không có middleware => lỗi không liên quan đến middleware
  2. Khi có token trong cookie, getLogin hoạt động bình thường => middleware không có vấn đề gì
  3. Vấn đề xảy ra khi => bấm logout => xóa token trong cookie => cook => đm :vvvv => đùa à
  03/08/2024 => vô fix bug => mọi chuyện lại hoạt động như thường => wtf => đùa tôi à :vvv
*/