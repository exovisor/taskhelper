import { NextApiRequest, NextApiResponse } from 'next';
import { parseQuery, validate } from 'lib/auth/telegram.user';
import { IProfile, Profile } from 'lib/schemas/profile.schema';
import dbConnect from 'lib/configs/mongo.config';
import { withSessionApiRoute } from 'lib/auth/session';

async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error(
      'Please define the TELEGRAM_BOT_TOKEN environment variable inside .env.local',
    );
  }
  const adminId = process.env.TELEGRAM_ADMIN_ID;
  if (!botToken) {
    throw new Error(
      'Please define the TELEGRAM_ADMIN_ID environment variable inside .env.local',
    );
  }

  try {
    const user = parseQuery(req.query);
    if (!validate(user, botToken)) {
      return res
        .status(403)
        .json({ success: false, message: 'Validation failed' });
    }

    if (user && user.photo_url === undefined) {
      user.photo_url =
        'https://ui-avatars.com/api/?format=png&name=' +
        user.first_name +
        (user.last_name ? '+' + user.last_name : '');
    }

    const profile: IProfile = {
      ...user,
      telegramId: user.id,
      fullname: user.first_name + (user.last_name ?? ''),
      photo_url:
        user.photo_url ??
        'https://ui-avatars.com/api/?format=png&name=' +
          user.first_name +
          (user.last_name ? '+' + user.last_name : ''),
    };

    req.session.user = { ...user, isAdmin: user.id === adminId };
    await req.session.save();

    await dbConnect();
    Profile.updateOne({ telegramId: user.id }, profile, {
      upsert: true,
    }).exec();

    res.redirect((req.query.redirectTo as string | undefined) ?? '/me');
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export default withSessionApiRoute(loginHandler);
