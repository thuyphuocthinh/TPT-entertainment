import { Request, Response } from "express";
import Songs from "../../models/songs.model";
import Singers from "../../models/singers.model";
import { Pagination } from "../../interfaces/system.interface";
import { pagination } from "../../helpers/pagination.helper";
import Topics from "../../models/topics.model";
import Users from "../../models/users.model";
import Playlists from "../../models/playlists.model";

export const index = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean;
      title?: RegExp;
      status?: string;
    }

    let find: Find = {
      deleted: false,
    };
    // pagination
    const countRecords = await Songs.countDocuments({ deleted: false });
    let currentPage: number = 1;
    if (req.query.page) {
      currentPage = Number(req.query.page);
    }
    let objPagination: Pagination = {
      currentPage: currentPage,
      totalPages: 0,
      skip: 0,
      limit: 4,
    };
    objPagination = pagination(objPagination, countRecords);

    const songs = await Songs.find(find)
      .limit(objPagination.limit)
      .skip(objPagination.skip);

    for (const song of songs) {
      if (song.title.length > 30)
        song.title = song.title.substring(0, 20) + "...";
      const singer = await Singers.findOne({
        _id: song.singerId,
        deleted: false,
      }).select("fullName");
      song["infoSinger"] = singer;
    }

    res.render("clients/pages/songs/index", {
      pageTitle: "Bài hát",
      songs,
      pagination: objPagination,
    });
  } catch (error) {
    console.log(error);
  }
};

export const detail = async (req: Request, res: Response) => {
  try {
    const slug: string = req.params.slug;
    const song = await Songs.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });
    const singer = await Singers.findOne({
      _id: song.singerId,
      deleted: false,
    }).select("fullName");
    const topic = await Topics.findOne({
      _id: song.topicId,
      deleted: false,
      status: "active",
    });
    const relatedSongs = await Songs.find({
      _id: { $ne: song.id },
      deleted: false,
      topicId: song.topicId,
      status: "active",
    });
    for (const song of relatedSongs) {
      if (song.title.length > 30)
        song.title = song.title.substring(0, 20) + "...";
      const singer = await Singers.findOne({
        _id: song.singerId,
        deleted: false,
      }).select("fullName");
      song["infoSinger"] = singer;
    }
    const pageTitle = song.title + " - " + singer.fullName;
    const playlists = await Playlists.find({
      deleted: false,
      songs: { $nin: [song.id] },
    });

    res.render("clients/pages/songs/detail", {
      pageTitle: pageTitle,
      song,
      singer,
      topic,
      relatedSongs,
      playlists,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateLike = async (req: Request, res: Response) => {
  try {
    const { typeLike, id } = req.params;
    const user = await Users.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
    });

    enum TYPE_LIKE {
      YES = "yes",
      NO = "no",
    }

    switch (typeLike) {
      case TYPE_LIKE.YES: {
        await Songs.updateOne(
          {
            _id: id,
          },
          {
            $push: { like: user.id },
          }
        );
        const song = await Songs.findOne({ _id: id, deleted: false });
        res.json({
          status: 200,
          data: song.like.length,
        });
        break;
      }
      case TYPE_LIKE.NO: {
        await Songs.updateOne(
          {
            _id: id,
          },
          {
            $pull: { like: user.id },
          }
        );
        const song = await Songs.findOne({ _id: id, deleted: false });
        res.json({
          status: 200,
          data: song.like.length,
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

export const updateFavourite = async (req: Request, res: Response) => {
  try {
    const { typeFavourite, id } = req.params;
    const user = await Users.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
    });

    enum TYPE_FAVOURITE {
      YES = "yes",
      NO = "no",
    }

    switch (typeFavourite) {
      case TYPE_FAVOURITE.YES: {
        await Users.updateOne(
          {
            _id: user.id,
          },
          {
            $push: { favouriteSongs: id },
          }
        );
        res.json({
          status: 200,
          data: "Đã thêm vào danh sách yêu thích",
        });
        break;
      }
      case TYPE_FAVOURITE.NO: {
        await Users.updateOne(
          {
            _id: user.id,
          },
          {
            $pull: { favouriteSongs: id },
          }
        );
        res.json({
          status: 200,
          data: "Đã xóa khỏi danh sách yêu thích",
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

export const updateListen = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const song = await Songs.findOne({
      _id: id,
      deleted: false,
      status: "active",
    });
    await Songs.updateOne(
      {
        _id: id,
      },
      {
        listen: song.listen + 1,
      }
    );
    res.json({
      status: 200,
      data: song.listen,
    });
  } catch (error) {
    console.log(error);
  }
};
