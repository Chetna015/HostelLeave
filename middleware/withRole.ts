import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

type Role = 'STUDENT' | 'PARENT' | 'ADMIN';

export const withRole = (roles: Role[]) => (handler: (req: NextApiRequest, res: NextApiResponse) => void) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const token = header.slice('Bearer '.length);
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
      const userId = typeof payload.userId === 'string' ? payload.userId : null;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user || !roles.includes(user.role as Role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      return handler(req, res);
    } catch {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
};
