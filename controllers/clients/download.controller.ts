import { Request, Response } from "express";
import * as downloadHelper from "../../helpers/download.helper";

export const download = async (req: Request, res: Response) => {
  try {
    const url: string = req.params.url;
    const arr = url.split("-");
    let newUrl = arr.join("/");
    newUrl = "https://" + newUrl;
    downloadHelper.downloadMp3(newUrl, "song.mp3");
    req.flash("success", "Tải thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
