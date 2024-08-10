import { Request, Response } from "express";
import Carousels from "../../models/carousels.model";
import Topics from "../../models/topics.model";
import Songs from "../../models/songs.model";
import Singers from "../../models/singers.model";

export const index = async (req: Request, res: Response) => {
  try {
    const carousels = await Carousels.find({ deleted: false });
    const topics = await Topics.find({ deleted: false, status: "active" });
    const songs = await Songs.find({ deleted: false, status: "active" });
    for (const song of songs) {
      if (song.title.length > 30)
        song.title = song.title.substring(0, 20) + "...";
      const singer = await Singers.findOne({
        _id: song.singerId,
        deleted: false,
      }).select("fullName");
      song["infoSinger"] = singer;
    }
    const singers = await Singers.find({ deleted: false, status: "active" });
    res.render("clients/pages/homepage/index", {
      pageTitle: "Trang chủ",
      carousels,
      topics,
      songs,
      singers,
    });
  } catch (error) {
    console.log(error);
  }
};
