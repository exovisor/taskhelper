import { withSessionApiRoute } from 'lib/auth/session';
import { NextApiRequest, NextApiResponse } from 'next';

async function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  await req.session.destroy();
  res.redirect('/');
}

export default withSessionApiRoute(logoutHandler);
