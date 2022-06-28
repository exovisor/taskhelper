import AdminLayout from 'components/layouts/AdminLayout';
import { withSessionSsr } from 'lib/auth/session';
import { IProfile } from 'lib/schemas/profile.schema';
import { ITask, Task } from 'lib/schemas/task.schema';
import { Types } from 'mongoose';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useState } from 'react';
import AdminTaskView from 'components/views/AdminTask';
import UpdateTaskView from 'components/views/UpdateTask';

export interface TaskPageProps {
  taskJSON?: string;
}

const TaskPage: NextPage = ({ taskJSON }: TaskPageProps) => {
  const task = JSON.parse(taskJSON ?? '')[0] as Omit<ITask, 'members'> & {
    members: IProfile[];
  };

  const [editMode, setEditMode] = useState(false);

  console.log(task);

  return (
    <AdminLayout>
      {editMode ? (
        <UpdateTaskView setEditMode={setEditMode} task={task} />
      ) : (
        <AdminTaskView setEditMode={setEditMode} task={task} />
      )}
    </AdminLayout>
  );
};

export default TaskPage;

async function handler(ctx: GetServerSidePropsContext) {
  const user = ctx.req.session.user;

  if (!user || user.isAdmin == false) {
    return {
      nofFound: true,
    };
  }

  const id = (ctx.query.id as string) ?? '';
  const oid = new Types.ObjectId(id);

  const task = await Task.aggregate([
    {
      $match: {
        _id: oid as unknown as string,
      },
    },
    {
      $lookup: {
        from: 'profiles',
        localField: 'members',
        foreignField: 'telegramId',
        as: 'members',
      },
    },
  ]).exec();
  if (!task) {
    return {
      notFound: true,
    };
  }

  return { props: { taskJSON: JSON.stringify(task) } };
}

export const getServerSideProps = withSessionSsr(handler);
