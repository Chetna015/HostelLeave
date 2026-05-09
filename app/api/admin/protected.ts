import { NextApiRequest, NextApiResponse } from 'next';
import { apiLimiter } from '@/middleware/rateLimiter';
import { withRole } from '@/middleware/withRole';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ message: 'This is a protected admin route' });
};

export default apiLimiter(withRole(['ADMIN'])(handler));
