import { Request, Response } from "express";
import md5 from "md5";
import Users from "../../models/users.model";
import { generateRandomString } from "../../helpers/generator.helper";

export const getLogin = async (req: Request, res: Response) => {
  try {
    if (req.cookies.tokenUser) {
      const checkToken = await Users.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false,
      });
      if (checkToken) {
        return res.redirect("/");
      }
    }
    res.render("clients/pages/auth/login", {
      pageTitle: "Đăng nhập",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRegister = async (req: Request, res: Response) => {
  try {
    res.render("clients/pages/auth/register", {
      pageTitle: "Đăng kí",
    });
  } catch (error) {
    console.log(error);
  }
};

export const postLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email: email });
    if (!user) {
      req.flash("error", "Email không tồn tại!");
      res.redirect("back");
      return;
    }
    if (user.password !== md5(password)) {
      req.flash("error", "Password sai!");
      res.redirect("back");
      return;
    }
    if (user.status === "inactive") {
      req.flash(
        "error",
        "Tài khoản hiện tại đang bị khóa! Vui lòng liên hệ admin để mở khóa!"
      );
      res.redirect("back");
      return;
    }

    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng nhập thành công");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

export const postRegister = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await Users.findOne({ email: email });
    if (user) {
      req.flash("error", "Email đã tồn tại!");
      res.render("clients/pages/auth/register", {
        pageTitle: "Đăng kí",
        fullName,
      });
      return;
    }

    const dataUser = {
      fullName: fullName,
      email: email,
      tokenUser: generateRandomString(30),
      password: md5(password),
    };

    const record = new Users(dataUser);
    await record.save();

    res.cookie("tokenUser", record.tokenUser);
    req.flash("success", "Đăng kí thành công");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    if (req.cookies.tokenUser) {
      res.clearCookie("tokenUser");
      req.flash("success", "Đăng xuất thành công");
      res.redirect("back");
    } else {
      res.redirect("back");
    }
  } catch (error) {
    console.log(error);
  }
};
