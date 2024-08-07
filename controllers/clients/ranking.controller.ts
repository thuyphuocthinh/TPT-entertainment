import { Request, Response } from "express";
import Songs from "../../models/songs.model";
import Singers from "../../models/singers.model";

export const index = async (req: Request, res: Response) => {
  try {
    const songs = await Songs.find({
      deleted: false,
      status: "active",
    }).sort({ listen: "desc" });
    for (const song of songs) {
      if (song.title.length > 30)
        song.title = song.title.substring(0, 20) + "...";
      const singer = await Singers.findOne({
        _id: song.singerId,
        deleted: false,
      }).select("fullName");
      song["infoSinger"] = singer;
    }
    res.render("clients/pages/ranking/index", {
      pageTitle: "Bảng xếp hạng",
      songs,
    });
  } catch (error) {
    console.log(error);
  }
};
