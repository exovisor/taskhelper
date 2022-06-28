import { withSessionApiRoute } from 'lib/auth/session';
import dbConnect from 'lib/configs/mongo.config';
import { IProfile, Profile } from 'lib/schemas/profile.schema';
import { ApiResponse } from 'lib/utils/api.types';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<IProfile>>,
) {
  const {
    method,
    session: { user },
  } = req;

  if (!user) {
    return res.status(400).json({ success: false });
  }

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const profile = await Profile.findOne({
          telegramId: user.id,
        }).exec();
        if (!profile) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: profile });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const input = JSON.parse(req.body);
        const saved = await Profile.updateOne(
          {
            telegramId: user.id,
          },
          input,
          { new: true },
        ).exec();
        if (!saved) {
          return res.status(400).json({ success: false });
        }
        res
          .status(200)
          .json({ success: true, data: saved as unknown as IProfile });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(404).json({ success: false });
  }
}

export default withSessionApiRoute(handler);
