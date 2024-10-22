import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'An unknown error occurred.' });
  } else {
    console.error('Unknown error type:', err);
    res.status(500).json({ error: 'An unknown error occurred.' });
  }
};




