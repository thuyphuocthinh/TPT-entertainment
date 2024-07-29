import { Pagination } from "../interfaces/system.interface";

export const pagination = (objPagination: Pagination, totalRecords: number): Pagination => {
    objPagination.skip = objPagination.limit * (objPagination.currentPage - 1);
    objPagination.totalPages = Math.ceil(totalRecords / objPagination.limit);
    return objPagination;
};
