import { CookieOptions } from 'express';

const authCookieOptions: CookieOptions = {
  // This is not good for CSRF
  sameSite: 'none',
  secure: true,
};

export default authCookieOptions;
