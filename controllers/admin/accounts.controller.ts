import { Request, Response } from "express";
import Topics from "../../models/topics.model";
import Roles from "../../models/roles.model";
import Accounts from "../../models/accounts.model";
import { search } from "../../helpers/search.helper";
import { Pagination } from "../../interfaces/system.interface";
import { pagination } from "../../helpers/pagination.helper";
import { systemConfig } from "../../config/system.config";

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
    let sortObj: {} = { email: "desc" };
    const sortCriteria: { keyValue: string; title: string }[] = [
      {
        keyValue: "title-desc",
        title: "Sắp xếp email giảm dần",
      },
      {
        keyValue: "title-asc",
        title: "Sắp xếp email tăng dần",
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
    const countRecords = await Accounts.countDocuments({ deleted: false });
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

    const accounts = await Accounts.find(find)
      .sort(sortObj)
      .limit(objPagination.limit)
      .skip(objPagination.skip);

    res.render("admin/pages/accounts/index", {
      pageTitle: "Quản lí vai trò",
      accounts,
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
    await Roles.updateOne(
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
    await Roles.updateOne({ _id: id, deleted: false }, { deleted: true });
    req.flash("success", "Xóa thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

export const getCreate = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/roles/create", {
      pageTitle: "Thêm vai trò",
    });
  } catch (error) {
    console.log(error);
  }
};

export const postCreate = async (req: Request, res: Response) => {
  try {
    const dataRole = {
      title: req.body.title,
      status: req.body.status,
      description: req.body.description,
    };

    const record = new Roles(dataRole);
    await record.save();
    req.flash("success", "Thêm vai trò mới thành công");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.log(error);
  }
};

export const getEdit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const role = await Roles.findOne({
      _id: id,
      deleted: false,
      status: "active",
    });
    res.render("admin/pages/roles/edit", {
      pageTitle: `Chỉnh sửa vai trò ${role.title}`,
      role,
    });
  } catch (error) {
    console.log(error);
  }
};

export const patchEdit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const dataRole = {
      title: req.body.title,
      status: req.body.status,
      description: req.body.description,
    };

    await Topics.updateOne(
      {
        _id: id,
      },
      dataRole
    );

    req.flash("success", "Chỉnh sửa thành công");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.log(error);
  }
};

