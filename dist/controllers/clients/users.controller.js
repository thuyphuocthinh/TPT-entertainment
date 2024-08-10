"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSong = exports.getTablePlaylist = exports.addSongToPlaylist = exports.deletePlaylist = exports.detailPlaylist = exports.postCreatePlaylists = exports.getCreatePlaylists = exports.getPlaylists = exports.favouriteSongs = exports.updatePassword = exports.getUpdatePassword = exports.updateProfile = exports.profile = exports.postResetPassword = exports.postOtp = exports.postForgotPassword = exports.getForgotPassword = exports.logout = exports.postRegister = exports.postLogin = exports.getRegister = exports.getLogin = void 0;
const generator_helper_1 = require("../../helpers/generator.helper");
const md5_1 = __importDefault(require("md5"));
const users_model_1 = __importDefault(require("../../models/users.model"));
const forgot_password_model_1 = __importDefault(require("../../models/forgot-password.model"));
const sendMail_helper_1 = require("../../helpers/sendMail.helper");
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const singers_model_1 = __importDefault(require("../../models/singers.model"));
const playlists_model_1 = __importDefault(require("../../models/playlists.model"));
const getLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.cookies.tokenUser) {
            const checkToken = yield users_model_1.default.findOne({
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
    }
    catch (error) {
        console.log(error);
    }
});
exports.getLogin = getLogin;
const getRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("clients/pages/auth/register", {
            pageTitle: "Đăng kí",
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getRegister = getRegister;
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield users_model_1.default.findOne({ email: email });
        if (!user) {
            req.flash("error", "Email không tồn tại!");
            res.redirect("back");
            return;
        }
        if (user.password !== (0, md5_1.default)(password)) {
            req.flash("error", "Password sai!");
            res.redirect("back");
            return;
        }
        if (user.status === "inactive") {
            req.flash("error", "Tài khoản hiện tại đang bị khóa! Vui lòng liên hệ admin để mở khóa!");
            res.redirect("back");
            return;
        }
        res.cookie("tokenUser", user.tokenUser);
        req.flash("success", "Đăng nhập thành công");
        res.redirect("/");
    }
    catch (error) {
        console.log(error);
    }
});
exports.postLogin = postLogin;
const postRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = req.body;
        const user = yield users_model_1.default.findOne({ email: email });
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
            tokenUser: (0, generator_helper_1.generateRandomString)(30),
            password: (0, md5_1.default)(password),
        };
        const record = new users_model_1.default(dataUser);
        yield record.save();
        res.cookie("tokenUser", record.tokenUser);
        req.flash("success", "Đăng kí thành công");
        res.redirect("/");
    }
    catch (error) {
        console.log(error);
    }
});
exports.postRegister = postRegister;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.cookies.tokenUser) {
            res.clearCookie("tokenUser");
            req.flash("success", "Đăng xuất thành công");
            res.redirect("back");
        }
        else {
            res.redirect("back");
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.logout = logout;
const getForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("clients/pages/auth/forgot-password", {
            pageTitle: "Quên mật khẩu",
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getForgotPassword = getForgotPassword;
const postForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield users_model_1.default.findOne({
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
            req.flash("error", `Tài khoản của email: ${email} đang bị khóa! Không thể lấy lại mật khẩu!`);
            res.redirect("back");
            return;
        }
        const data = new forgot_password_model_1.default({
            email,
            otp: (0, generator_helper_1.generateRandomNumber)(6),
        });
        yield data.save();
        const subject = "Reset Password";
        const html = `
      <p>Here is OTP to reset password: <b>${data.otp}</b></p>
      <p>This otp is valid in 3 minutes</p>
    `;
        (0, sendMail_helper_1.sendMail)(email, subject, html);
        req.flash("success", `Đã gửi mã OTP qua email ${email}, vui lòng kiểm tra hộp thư.`);
        res.render("clients/pages/auth/otp", {
            pageTitle: "Nhập mã OTP",
            email,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.postForgotPassword = postForgotPassword;
const postOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = req.body.otp;
        const email = req.body.email;
        const checkOtp = yield forgot_password_model_1.default.findOne({
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
    }
    catch (error) {
        console.log(error);
    }
});
exports.postOtp = postOtp;
const postResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, confirmPassword, email } = req.body;
        if (password !== confirmPassword) {
            req.flash("error", "Xác nhận mật khẩu không khớp!");
            res.redirect("back");
            return;
        }
        const user = yield users_model_1.default.findOne({
            email: email,
            deleted: false,
            status: "active",
        });
        if (user) {
            yield users_model_1.default.updateOne({
                _id: user.id,
            }, {
                password: (0, md5_1.default)(password),
            });
            req.flash("success", "Lấy lại mật khẩu thành công");
            res.redirect("/auth/login");
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.postResetPassword = postResetPassword;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenUser = req.cookies.tokenUser;
        const user = yield users_model_1.default.findOne({
            tokenUser: tokenUser,
            deleted: false,
            status: "active",
        });
        res.render("clients/pages/users/index", {
            pageTitle: "Tài khoản",
            user,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.profile = profile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fullName = req.body.fullName;
        yield users_model_1.default.updateOne({
            tokenUser: req.cookies.tokenUser,
        }, {
            fullName: fullName,
        });
        req.flash("success", "Cập nhật thành công");
        res.redirect("back");
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateProfile = updateProfile;
const getUpdatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("clients/pages/users/updatePassword", {
            pageTitle: "Đổi mật khẩu",
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUpdatePassword = getUpdatePassword;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, password, confirmPassword } = req.body;
        const user = yield users_model_1.default.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
        });
        if (user.password !== (0, md5_1.default)(oldPassword)) {
            req.flash("error", "Mật khẩu cũ sai");
            res.redirect("back");
            return;
        }
        if (password !== confirmPassword) {
            req.flash("error", "Mật khẩu không khớp");
            res.redirect("back");
            return;
        }
        yield users_model_1.default.updateOne({
            tokenUser: req.cookies.tokenUser,
        }, {
            password: (0, md5_1.default)(password),
        });
        req.flash("success", "Cập nhật thành công");
        res.redirect("back");
    }
    catch (error) {
        console.log(error);
    }
});
exports.updatePassword = updatePassword;
const favouriteSongs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_model_1.default.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
        });
        const favouriteSongs = user.favouriteSongs;
        const songs = yield songs_model_1.default.find({
            _id: { $in: favouriteSongs },
            deleted: false,
            status: "active",
        });
        const singers = [];
        for (const song of songs) {
            const singer = yield singers_model_1.default.findOne({
                _id: song.singerId,
                deleted: false,
                status: "active",
            });
            singers.push((singer === null || singer === void 0 ? void 0 : singer.fullName) || "Artist");
        }
        res.render("clients/pages/users/favouriteSongs", {
            pageTitle: "Bài hát yêu thích",
            songs,
            singers,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.favouriteSongs = favouriteSongs;
const getPlaylists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlists = yield playlists_model_1.default.find({ deleted: false });
        res.render("clients/pages/users/playlists", {
            pageTitle: "Danh sách phát",
            playlists,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getPlaylists = getPlaylists;
const getCreatePlaylists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield songs_model_1.default.find({
            deleted: false,
            status: "active",
        });
        for (const song of songs) {
            const singer = yield singers_model_1.default.findOne({
                _id: song.singerId,
                deleted: false,
            }).select("fullName");
            song["infoSinger"] = singer;
        }
        res.render("clients/pages/users/createPlaylist", {
            pageTitle: "Thêm mới playlist",
            songs,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getCreatePlaylists = getCreatePlaylists;
const postCreatePlaylists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, songs } = req.body;
        const user = yield users_model_1.default.findOne({ tokenUser: req.cookies.tokenUser });
        const data = {
            title,
            songs,
            userId: user.id,
        };
        const record = new playlists_model_1.default(data);
        yield record.save();
        req.flash("success", "Thêm mới danh sách phát thành công");
        res.redirect("/users/playlists");
    }
    catch (error) {
        console.log(error);
    }
});
exports.postCreatePlaylists = postCreatePlaylists;
const detailPlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slug;
        const playlist = yield playlists_model_1.default.findOne({ slug: slug });
        const songs = yield songs_model_1.default.find({
            _id: { $in: playlist.songs },
            deleted: false,
            status: "active",
        });
        const singers = [];
        for (const song of songs) {
            const singer = yield singers_model_1.default.findOne({
                _id: song.singerId,
                deleted: false,
                status: "active",
            });
            singers.push((singer === null || singer === void 0 ? void 0 : singer.fullName) || "Artist");
        }
        res.render("clients/pages/users/detailPlaylist", {
            pageTitle: playlist.title,
            songs,
            singers,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.detailPlaylist = detailPlaylist;
const deletePlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield playlists_model_1.default.updateOne({
            _id: id,
        }, {
            deleted: true,
        });
        req.flash("success", "Xóa thành công");
        res.redirect("back");
    }
    catch (error) {
        console.log(error);
    }
});
exports.deletePlaylist = deletePlaylist;
const addSongToPlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { playlistId, songId } = req.body;
        yield playlists_model_1.default.updateOne({
            _id: playlistId,
        }, {
            $push: { songs: songId },
        });
        req.flash("success", "Đã thêm vào playlist");
        res.redirect("back");
    }
    catch (error) {
        console.log(error);
    }
});
exports.addSongToPlaylist = addSongToPlaylist;
const getTablePlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slug;
        const playlist = yield playlists_model_1.default.findOne({
            slug: slug,
            deleted: false,
        });
        const songs = yield songs_model_1.default.find({
            _id: { $in: playlist.songs },
            deleted: false,
            status: "active",
        });
        for (const song of songs) {
            const singer = yield singers_model_1.default.findOne({
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
    }
    catch (error) {
        console.log(error);
    }
});
exports.getTablePlaylist = getTablePlaylist;
const deleteSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songId = req.params.songId;
        const playlistId = req.params.playlistId;
        yield playlists_model_1.default.updateOne({
            _id: playlistId,
        }, {
            $pull: { songs: songId },
        });
        req.flash("success", "Xóa thành công");
        res.redirect("back");
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteSong = deleteSong;
