import { PostImageUsecase } from 'application/usecases/PostImageUsecase';
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != 'GET') res.status(405);

  const id: string = req.query.id as string;
  const block = await PostImageUsecase.getInPost(id);

  res.status(200).json(block);
}


