import { withSessionApiRoute } from 'lib/auth/session';
import dbConnect from 'lib/configs/mongo.config';
import { Task } from 'lib/schemas/task.schema';
import { ApiResponse } from 'lib/utils/api.types';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<string[]>>,
) {
  const {
    method,
    session: { user },
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const tags = await getCategories();
        if (!tags || tags.length < 1) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: tags });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(404).json({ success: false });
  }
}

export default withSessionApiRoute(handler);

async function getCategories() {
  return Task.distinct('category').exec();
}
