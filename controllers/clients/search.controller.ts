import { Request, Response } from "express";
import Songs from "../../models/songs.model";
import Singers from "../../models/singers.model";
import { convertToSlug } from "../../helpers/convertToSlug.helper";

export const search = async (req: Request, res: Response) => {
  try {
    const type: string = req.params.type;
    const keyword: string = req.query.keyword.toString();
    let newSongs = [];

    if (keyword) {
      const keywordRegex = new RegExp(keyword, "i");
      const stringSlug: string = convertToSlug(keyword);
      const stringSlugRegex = new RegExp(stringSlug, "i");

      const songs = await Songs.find({
        $or: [
          {
            title: keywordRegex,
          },
          {
            slug: stringSlugRegex,
          },
        ],
        deleted: false,
        status: "active",
      });

      for (const item of songs) {
        const infoSinger = await Singers.findOne({
          _id: item.singerId,
        });

        newSongs.push({
          id: item.id,
          title: item.title,
          avatar: item.avatar,
          like: item.like,
          slug: item.slug,
          infoSinger: {
            fullName: infoSinger.fullName,
          },
        });
      }
    }

    switch (type) {
      case "result": {
        res.render("clients/pages/search/result", {
          pageTitle: `Kết quả: ${keyword}`,
          keyword,
          songs: newSongs,
        });
        break;
      }
      case "suggest": { 
        res.json({
          status: 200,
          message: "Thành công",
          songs: newSongs,
        });
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
};
