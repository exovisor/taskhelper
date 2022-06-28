import { User, withSessionApiRoute } from 'lib/auth/session';
import { ApiResponse } from 'lib/utils/api.types';
import { NextApiRequest, NextApiResponse } from 'next';

async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User>>,
) {
  if (req.session.user) {
    res.json({
      success: true,
      data: { ...req.session.user },
    });
  } else {
    res.status(401).json({
      success: false,
    });
  }
}

export default withSessionApiRoute(userHandler);
