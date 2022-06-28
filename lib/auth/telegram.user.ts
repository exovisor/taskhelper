import { HmacSHA256, SHA256 } from 'crypto-js';

export interface ITelegramUser {
  id: string;
  first_name: string;
  last_name?: string;

  username: string;

  photo_url?: string;

  auth_date: string;
  hash: string;
}

export const validate = (user: ITelegramUser, token: string) => {
  const message = Object.keys(user)
    .filter(
      (key) => user[key as keyof ITelegramUser] !== undefined && key !== 'hash',
    )
    .map((key) => `${key}=${user[key as keyof ITelegramUser]}`)
    .sort()
    .join('\n');

  const secret = SHA256(token);
  const hash = String(HmacSHA256(message, secret));

  return user.hash === hash;
};

export const parseQuery = (query: {
  [key: string]: string | string[];
}): ITelegramUser => {
  return {
    id: query.id as string,
    first_name: query.first_name as string,
    last_name: query.last_name as string,
    username: query.username as string,
    photo_url: query.photo_url as string,
    auth_date: query.auth_date as string,
    hash: query.hash as string,
  };
};
