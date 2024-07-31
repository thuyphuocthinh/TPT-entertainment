/// <reference types="express" />

/**
 * This type definition augments existing definition
 * from @types/express-flash
 */

declare namespace Express {
  export interface Request {
    flash(event: string, message: any): any;
  }
}

interface Flash {
  flash(type: string, message: any): void;
}

declare module "express-flash";

/*
  - Muốn tác động vào express typescript thì cần phải tải @types/...
  - Sau đó, để thêm vào Request => cần mở rộng interface Request
  - Định nghĩa interface chuẩn cho thư viện này
  - Thông báo với ứng dụng về sự tồn tại của module này
*/