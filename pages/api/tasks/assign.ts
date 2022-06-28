import { withSessionApiRoute } from 'lib/auth/session';
import dbConnect from 'lib/configs/mongo.config';
import { Task } from 'lib/schemas/task.schema';
import { ApiResponse } from 'lib/utils/api.types';
import { Types } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<string>>,
) {
  const {
    session: { user },
    query: { action, id, redirect },
  } = req;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const safeRedirect = redirect ?? '';

  const safeAction =
    action && action == 'subscribe' ? 'subscribe' : 'unsubscribe';

  await dbConnect();

  switch (safeAction) {
    case 'subscribe':
      try {
        const result = await Task.findByIdAndUpdate(id, {
          $addToSet: {
            members: user.id,
          },
        }).exec();

        console.log(id);

        if (safeRedirect !== '') {
          return res.redirect(safeRedirect as string);
        }
        res
          .status(200)
          .json({ success: true, data: `Subscribed user ${user.id} to ${id}` });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'unsubscribe':
      try {
        const result = await Task.findByIdAndUpdate(id, {
          $pull: {
            members: user.id,
          },
        }).exec();

        console.log(result);

        if (safeRedirect !== '') {
          return res.redirect(safeRedirect as string);
        }
        res.status(200).json({
          success: true,
          data: `Unsubscribed user ${user.id} from ${id}`,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(404).json({ success: false });
  }
}

export default withSessionApiRoute(handler);
