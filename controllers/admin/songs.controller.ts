import { Request, Response } from "express";
import { search } from "../../helpers/search.helper";
import Songs from "../../models/songs.model";
import Singers from "../../models/singers.model";
import Topics from "../../models/topics.model";
import { Pagination } from "../../interfaces/system.interface";
import { pagination } from "../../helpers/pagination.helper";

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

    // search
    if (req.query.search) {
      find.title = search(req).regex;
    }

    // sort criteria
    let sortBy: string = "";
    let sortObj: {} = { title: "desc" };
    const sortCriteria: { keyValue: string; title: string }[] = [
      {
        keyValue: "title-desc",
        title: "Sắp xếp tên bài hát giảm dần",
      },
      {
        keyValue: "title-asc",
        title: "Sắp xếp tên bài hát tăng dần",
      },
    ];

    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toString();
      const sortValue = req.query.sortValue.toString();
      sortBy = sortKey + "-" + sortValue;
      sortObj[sortKey] = sortValue;
    }

    // filter
    let filter: string = "";
    const filterCriteria: { title: string; value: string }[] = [
      {
        title: "All",
        value: "",
      },
      {
        title: "Active",
        value: "active",
      },
      {
        title: "Inactive",
        value: "inactive",
      },
    ];

    if (req.query.status) {
      find.status = req.query.status.toString();
      filter = req.query.status.toString();
    }

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

    const songs = await Songs.find(find).sort(sortObj);
    for (const song of songs) {
      const singer = await Singers.findOne({
        _id: song.singerId,
        deleted: false,
      }).select("fullName");
      const topic = await Topics.findOne({
        _id: song.topicId,
        deleted: false,
      });
      song["infoSinger"] = singer;
      song["infoTopic"] = topic;
    }

    res.render("admin/pages/songs/index", {
      pageTitle: "Quản lí bài hát",
      songs,
      keyword: req.query.search || "",
      sortCriteria,
      sortBy: sortBy,
      filterCriteria,
      filter,
      pagination: objPagination,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const statusChange: string = req.params.status;
    const id: string = req.params.id;
    await Songs.updateOne(
      {
        _id: id,
      },
      {
        status: statusChange,
      }
    );
    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

export const changeMulti = async (req: Request, res: Response) => {
  try {
    const updateObj: { changeMulti: string; ids: string } = JSON.parse(
      req.body.updateInfo
    );

    const typeChange: string = updateObj.changeMulti;
    const ids: string[] = updateObj.ids.split("-");
    enum CHANGE_MULTI {
      DELETE_ALL = "deleteAll",
      CHANGE_STATUS = "changeStatus",
    }

    switch (typeChange) {
      case CHANGE_MULTI.DELETE_ALL: {
        ids.forEach(async (id) => {
          await Songs.updateOne(
            {
              _id: id,
              deleted: false,
            },
            {
              deleted: true,
            }
          );
        });
        req.flash("success", "Cập nhật thành công");
        break;
      }
      case CHANGE_MULTI.CHANGE_STATUS: {
        ids.forEach(async (id) => {
          const song = await Songs.findOne({ _id: id, deleted: false });
          const statusChange = song.status === "active" ? "inactive" : "active";
          await Songs.updateOne(
            { _id: id, deleted: false },
            {
              status: statusChange,
            }
          );
        });
        req.flash("success", "Cập nhật thành công");
        break;
      }
      default:
        req.flash("error", "Lỗi cập nhật");
        break;
    }

    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
