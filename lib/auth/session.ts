import { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { ITelegramUser } from './telegram.user';

export type User = ITelegramUser & { isAdmin: boolean };
declare module 'iron-session' {
  interface IronSessionData {
    user?: User;
  }
}

export const sessionOptions: IronSessionOptions = {
  password: (process.env.TELEGRAM_BOT_TOKEN as string) + '_taskhelper',
  cookieName: 'taskhelper/auth/token',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export const withSessionApiRoute = (handler: NextApiHandler<any>) =>
  withIronSessionApiRoute(handler, sessionOptions);

export const withSessionSsr = (component: any) =>
  withIronSessionSsr(component, sessionOptions);
