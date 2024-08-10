"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const pagination = (objPagination, totalRecords) => {
    objPagination.skip = objPagination.limit * (objPagination.currentPage - 1);
    objPagination.totalPages = Math.ceil(totalRecords / objPagination.limit);
    return objPagination;
};
exports.pagination = pagination;
