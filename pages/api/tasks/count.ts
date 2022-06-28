import { withSessionApiRoute } from 'lib/auth/session';
import dbConnect from 'lib/configs/mongo.config';
import { Task, TaskFilters } from 'lib/schemas/task.schema';
import { ApiResponse } from 'lib/utils/api.types';
import { PipelineStage } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { filtersFromQuery } from './find';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<number>>,
) {
  const {
    method,
    session: { user },
    query,
  } = req;

  const filters = filtersFromQuery(query);

  if (user && user.isAdmin && query.type) {
    filters.type = query.type as string;
  }

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const amount = await countWithFilters(filters);
        res.status(200).json({
          success: true,
          data: amount && amount.length > 0 ? amount[0].count : 0,
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

async function countWithFilters(filters: TaskFilters) {
  const aggregatePipeline = pipelineBuilder(filters);
  return Task.aggregate(aggregatePipeline).exec();
}

function pipelineBuilder(filters: TaskFilters): PipelineStage[] {
  const stages: PipelineStage[] = [];
  if (filters.type) {
    stages.push({
      $match: {
        status: filters.type,
      },
    });
  } else {
    stages.push({
      $match: {
        status: 'published',
      },
    });
  }

  if (filters.category) {
    stages.push({
      $match: {
        category: filters.category,
      },
    });
  }

  if (!filters.showOutdated) {
    stages.push({
      $match: {
        deadline: { $gt: new Date() },
      },
    });
  }

  if (filters.tag && filters.tag.length > 0) {
    stages.push({
      $match: {
        $expr: {
          $setIsSubset: [filters.tag, '$tags'],
        },
      },
    });
  }

  stages.push({
    $count: 'count',
  });

  return stages;
}
