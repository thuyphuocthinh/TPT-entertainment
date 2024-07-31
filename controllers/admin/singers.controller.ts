import { Request, Response } from "express";
import Topics from "../../models/topics.model";
import Singers from "../../models/singers.model";
import { search } from "../../helpers/search.helper";
import { Pagination } from "../../interfaces/system.interface";
import { pagination } from "../../helpers/pagination.helper";
import { systemConfig } from "../../config/system.config";

export const index = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean;
      fullName?: RegExp;
      status?: string;
    }

    let find: Find = {
      deleted: false,
    };

    // search
    if (req.query.search) {
      find.fullName = search(req).regex;
    }

    // sort criteria
    let sortBy: string = "";
    let sortObj: {} = { title: "desc" };
    const sortCriteria: { keyValue: string; title: string }[] = [
      {
        keyValue: "title-desc",
        title: "Sắp xếp tên ca sĩ giảm dần",
      },
      {
        keyValue: "title-asc",
        title: "Sắp xếp tên ca sĩ tăng dần",
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
    const countRecords = await Singers.countDocuments({ deleted: false });
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

    const singers = await Singers.find(find)
      .sort(sortObj)
      .limit(objPagination.limit)
      .skip(objPagination.skip);

    res.render("admin/pages/singers/index", {
      pageTitle: "Quản lí ca sĩ",
      singers,
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
    await Singers.updateOne(
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
          await Topics.updateOne(
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
          const topic = await Topics.findOne({ _id: id, deleted: false });
          const statusChange =
            topic.status === "active" ? "inactive" : "active";
          await Topics.updateOne(
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

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Singers.updateOne({ _id: id, deleted: false }, { deleted: true });
    req.flash("success", "Xóa thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

export const getCreate = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/singers/create", {
      pageTitle: "Thêm chủ đề",
    });
  } catch (error) {
    console.log(error);
  }
};

export const postCreate = async (req: Request, res: Response) => {
  try {
    let avatar = "";
    if (req.body.avatar) {
      avatar = req.body.avatar;
    }

    const dataSinger = {
      fullName: req.body.fullName,
      status: req.body.status,
      avatar: avatar,
    };

    const record = new Singers(dataSinger);
    await record.save();
    req.flash("success", "Thêm bài hát mới thành công");
    res.redirect(`${systemConfig.prefixAdmin}/singers`);
  } catch (error) {
    console.log(error);
  }
};

export const getEdit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const singer = await Singers.findOne({
      _id: id,
      deleted: false,
      status: "active",
    });
    res.render("admin/pages/singers/edit", {
      pageTitle: `Chỉnh sửa ca sĩ ${singer.fullName}`,
      singer,
    });
  } catch (error) {
    console.log(error);
  }
};

export const patchEdit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const dataSinger = {
      fullName: req.body.fullName,
      status: req.body.status,
    };

    if (req.body.avatar) {
      dataSinger["avatar"] = req.body.avatar;
    }

    await Singers.updateOne(
      {
        _id: id,
      },
      dataSinger
    );

    req.flash("success", "Chỉnh sửa thành công");
    res.redirect(`${systemConfig.prefixAdmin}/singers`);
  } catch (error) {
    console.log(error);
  }
};

export const getDetail = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const singer = await Singers.findOne({ _id: id, deleted: false });
    res.render("admin/pages/singers/detail", {
      pageTitle: `Chi tiết ca sĩ ${singer.fullName}`,
      singer,
    });
  } catch (error) {
    console.log(error);
  }
};
