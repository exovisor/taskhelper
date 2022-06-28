import { withSessionApiRoute } from 'lib/auth/session';
import dbConnect from 'lib/configs/mongo.config';
import { ITask, Task, TaskFilters } from 'lib/schemas/task.schema';
import { ApiResponse } from 'lib/utils/api.types';
import { Expression, PipelineStage, Types } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Omit<ITask, 'content'>[]>>,
) => {
  const {
    method,
    query,
    session: { user },
    body,
  } = req;

  const filters: TaskFilters = filtersFromQuery(query);

  if (user && user.isAdmin && query.type) {
    filters.type = query.type as string;
  }

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const tasks = await getTasks(filters);
        if (!tasks) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: tasks });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      if (!user || user.isAdmin == false) {
        return res
          .status(400)
          .json({ success: false, message: 'Unauthorized.' });
      }
      try {
        const parsed = JSON.parse(body);
        const id = parsed._id
          ? new Types.ObjectId(parsed._id)
          : new Types.ObjectId();
        const savedTask = await Task.updateOne(
          {
            _id: id,
          },
          parsed,
          {
            upsert: true,
          },
        ).exec();
        if (!savedTask) {
          console.log('QUERY FAIL', savedTask);
          return res
            .status(400)
            .json({ success: false, message: 'Failed to run query.' });
        }
        res.status(200).json({ success: true, data: savedTask });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(404).json({ success: false });
  }
};

export default withSessionApiRoute(handler);

export function filtersFromQuery(query: {
  [key: string]: string | string[];
}): TaskFilters {
  const tags =
    typeof query.tags === 'string' ? query.tags.split(',') : query.tags;
  return {
    limit: Number(query.limit) > 0 ? Number(query.limit) : 10,
    page: Number(query.page) > 0 ? Number(query.page) : 0,

    tag: tags,

    sortBy: (query.sortBy as string) ? (query.sortBy as string) : 'createdAt',
    sortAsc: query.sortAsc ? true : false,

    category: query.category as string,

    showOutdated: query.showOutdated ? true : false,
    type: 'published',
  };
}

async function getTasks(filters: TaskFilters) {
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

  const sort: Record<string, 1 | -1> = {};
  sort[filters.sortBy ?? 'createdAt'] = filters.sortAsc ? 1 : -1;

  stages.push({
    $sort: { ...sort },
  });

  stages.push({
    $skip: (filters.limit ?? 10) * (filters.page ?? 0),
  });

  stages.push({
    $limit: filters.limit ?? 10,
  });

  stages.push({
    $project: {
      content: 0,
    },
  });

  return stages;
}
