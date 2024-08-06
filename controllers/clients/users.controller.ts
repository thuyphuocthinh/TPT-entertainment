import { Request, Response } from "express";
import {
  generateRandomNumber,
  generateRandomString,
} from "../../helpers/generator.helper";
import md5 from "md5";
import Users from "../../models/users.model";
import ForgotPassword from "../../models/forgot-password.model";
import { sendMail } from "../../helpers/sendMail.helper";

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

export const getForgotPassword = async (req: Request, res: Response) => {
  try {
    res.render("clients/pages/auth/forgot-password", {
      pageTitle: "Quên mật khẩu",
    });
  } catch (error) {
    console.log(error);
  }
};

export const postForgotPassword = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const user = await Users.findOne({
      email: email,
      deleted: false,
      status: "active",
    });

    if (!user) {
      req.flash("error", "Email không tồn tại!");
      res.redirect("back");
      return;
    }

    if (user.status === "inactive") {
      req.flash(
        "error",
        `Tài khoản của email: ${email} đang bị khóa! Không thể lấy lại mật khẩu!`
      );
      res.redirect("back");
      return;
    }

    // create otp
    const data = new ForgotPassword({
      email,
      otp: generateRandomNumber(6),
    });

    await data.save();

    // send mail
    const subject: string = "Reset Password";
    const html = `
      <p>Here is OTP to reset password: <b>${data.otp}</b></p>
      <p>This otp is valid in 3 minutes</p>
    `;
    sendMail(email, subject, html);

    req.flash(
      "success",
      `Đã gửi mã OTP qua email ${email}, vui lòng kiểm tra hộp thư.`
    );
    res.render("clients/pages/auth/otp", {
      pageTitle: "Nhập mã OTP",
      email,
    });
  } catch (error) {
    console.log(error);
  }
};

export const postOtp = async (req: Request, res: Response) => {
  try {
    const otp: string = req.body.otp;
    const email: string = req.body.email;

    const checkOtp = await ForgotPassword.findOne({
      email: email,
      otp: otp,
    });

    if (!checkOtp) {
      req.flash("error", "Mã OTP không hợp lệ!");
      res.redirect("back");
      return;
    }

    req.flash("success", "Mã OTP hợp lệ!");
    res.render("clients/pages/auth/reset-password", {
      pageTitle: "Đặt lại mật khẩu",
      email,
    });
  } catch (error) {
    console.log(error);
  }
};

export const postResetPassword = async (req: Request, res: Response) => {
  try {
    const { password, confirmPassword, email } = req.body;
    if (password !== confirmPassword) {
      req.flash("error", "Xác nhận mật khẩu không khớp!");
      res.redirect("back");
      return;
    }
    const user = await Users.findOne({
      email: email,
      deleted: false,
      status: "active",
    });

    if (user) {
      await Users.updateOne(
        {
          _id: user.id,
        },
        {
          password: md5(password),
        }
      );
      req.flash("success", "Lấy lại mật khẩu thành công");
      res.redirect("/auth/login");
    }
  } catch (error) {
    console.log(error);
  }
};
