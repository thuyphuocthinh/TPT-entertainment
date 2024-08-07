import { Request, Response } from "express";
import { Pagination } from "../../interfaces/system.interface";
import { pagination } from "../../helpers/pagination.helper";
import Topics from "../../models/topics.model";
import Songs from "../../models/songs.model";
import Singers from "../../models/singers.model";

export const index = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean;
      title?: RegExp;
      status?: string;
    }

    let find: Find = {
      deleted: false,
      status: "active",
    };
    // pagination
    const countRecords = await Topics.countDocuments(find);
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

    const topics = await Topics.find(find)
      .limit(objPagination.limit)
      .skip(objPagination.skip);

    res.render("clients/pages/topics/index", {
      pageTitle: "Bài hát",
      topics,
      pagination: objPagination,
    });
  } catch (error) {
    console.log(error);
  }
};

export const detail = async (req: Request, res: Response) => {
  try {
    const slug: string = req.params.slug;
    const topic = await Topics.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });
    const songs = await Songs.find({
      topicId: topic.id,
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
    res.render("clients/pages/topics/detail", {
      pageTitle: topic.title,
      songs,
      singers,
    });
  } catch (error) {
    console.log(error);
  }
};
