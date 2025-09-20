declare namespace Express {
  interface Request {
    user?: any;
    userRole?: 'USER' | 'BUSINESS' | 'ADMIN';
  }
}
