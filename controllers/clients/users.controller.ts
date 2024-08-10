import { Request, Response } from "express";
import {
  generateRandomNumber,
  generateRandomString,
} from "../../helpers/generator.helper";
import md5 from "md5";
import Users from "../../models/users.model";
import ForgotPassword from "../../models/forgot-password.model";
import { sendMail } from "../../helpers/sendMail.helper";
import Songs from "../../models/songs.model";
import Singers from "../../models/singers.model";
import Playlists from "../../models/playlists.model";

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

export const profile = async (req: Request, res: Response) => {
  try {
    const tokenUser: string = req.cookies.tokenUser;
    const user = await Users.findOne({
      tokenUser: tokenUser,
      deleted: false,
      status: "active",
    });
    res.render("clients/pages/users/index", {
      pageTitle: "Tài khoản",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const fullName: string = req.body.fullName;
    await Users.updateOne(
      {
        tokenUser: req.cookies.tokenUser,
      },
      {
        fullName: fullName,
      }
    );
    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

export const getUpdatePassword = async (req: Request, res: Response) => {
  try {
    res.render("clients/pages/users/updatePassword", {
      pageTitle: "Đổi mật khẩu",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body;

    const user = await Users.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
    });

    if (user.password !== md5(oldPassword)) {
      req.flash("error", "Mật khẩu cũ sai");
      res.redirect("back");
      return;
    }

    if (password !== confirmPassword) {
      req.flash("error", "Mật khẩu không khớp");
      res.redirect("back");
      return;
    }

    await Users.updateOne(
      {
        tokenUser: req.cookies.tokenUser,
      },
      {
        password: md5(password),
      }
    );

    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

export const favouriteSongs = async (req: Request, res: Response) => {
  try {
    const user = await Users.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
    });
    const favouriteSongs = user.favouriteSongs;
    const songs = await Songs.find({
      _id: { $in: favouriteSongs },
      deleted: false,
      status: "active",
    });
    const singers = [];
    for (const song of songs) {
      const singer = await Singers.findOne({
        _id: song.singerId,
        deleted: false,
        status: "active",
      });
      singers.push(singer?.fullName || "Artist");
    }
    res.render("clients/pages/users/favouriteSongs", {
      pageTitle: "Bài hát yêu thích",
      songs,
      singers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPlaylists = async (req: Request, res: Response) => {
  try {
    const playlists = await Playlists.find({ deleted: false });
    res.render("clients/pages/users/playlists", {
      pageTitle: "Danh sách phát",
      playlists,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCreatePlaylists = async (req: Request, res: Response) => {
  try {
    const songs = await Songs.find({
      deleted: false,
      status: "active",
    });
    for (const song of songs) {
      const singer = await Singers.findOne({
        _id: song.singerId,
        deleted: false,
      }).select("fullName");
      song["infoSinger"] = singer;
    }
    res.render("clients/pages/users/createPlaylist", {
      pageTitle: "Thêm mới playlist",
      songs,
    });
  } catch (error) {
    console.log(error);
  }
};

export const postCreatePlaylists = async (req: Request, res: Response) => {
  try {
    const { title, songs } = req.body;
    const user = await Users.findOne({ tokenUser: req.cookies.tokenUser });
    const data = {
      title,
      songs,
      userId: user.id,
    };
    const record = new Playlists(data);
    await record.save();
    req.flash("success", "Thêm mới danh sách phát thành công");
    res.redirect("/users/playlists");
  } catch (error) {
    console.log(error);
  }
};

export const detailPlaylist = async (req: Request, res: Response) => {
  try {
    const slug: string = req.params.slug;
    const playlist = await Playlists.findOne({ slug: slug });
    const songs = await Songs.find({
      _id: { $in: playlist.songs },
      deleted: false,
      status: "active",
    });
    const singers = [];
    for (const song of songs) {
      const singer = await Singers.findOne({
        _id: song.singerId,
        deleted: false,
        status: "active",
      });
      singers.push(singer?.fullName || "Artist");
    }
    res.render("clients/pages/users/detailPlaylist", {
      pageTitle: playlist.title,
      songs,
      singers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Playlists.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
      }
    );
    req.flash("success", "Xóa thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

export const addSongToPlaylist = async (req: Request, res: Response) => {
  try {
    const { playlistId, songId } = req.body;
    await Playlists.updateOne(
      {
        _id: playlistId,
      },
      {
        $push: { songs: songId },
      }
    );
    req.flash("success", "Đã thêm vào playlist");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

export const getTablePlaylist = async (req: Request, res: Response) => {
  try {
    const slug: string = req.params.slug;
    const playlist = await Playlists.findOne({
      slug: slug,
      deleted: false,
    });
    const songs = await Songs.find({
      _id: { $in: playlist.songs },
      deleted: false,
      status: "active",
    });

    for (const song of songs) {
      const singer = await Singers.findOne({
        _id: song.singerId,
        deleted: false,
      }).select("fullName");
      song["infoSinger"] = singer;
    }
    res.render("clients/pages/users/tablePlaylist", {
      pageTitle: playlist.title,
      songs,
      playlist,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteSong = async (req: Request, res: Response) => {
  try {
    const songId: string = req.params.songId;
    const playlistId: string = req.params.playlistId;

    await Playlists.updateOne(
      {
        _id: playlistId,
      },
      {
        $pull: { songs: songId },
      }
    );
    req.flash("success", "Xóa thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
