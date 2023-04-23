import { removeTokenCookie } from '@/apollo/cookies';
import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  removeTokenCookie(res);
  res.json({ success: true });
}
