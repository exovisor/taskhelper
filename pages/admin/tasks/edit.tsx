import AdminLayout from 'components/layouts/AdminLayout';
import { withSessionSsr } from 'lib/auth/session';
import { IProfile } from 'lib/schemas/profile.schema';
import { ITask, Task } from 'lib/schemas/task.schema';
import { Types } from 'mongoose';
import type { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import AdminTaskView from 'components/views/AdminTask';
import UpdateTaskView from 'components/views/UpdateTask';

export interface TaskPageProps {
  initialData?: string;
}

const TaskPage = ({ initialData }: TaskPageProps) => {
  const data = JSON.parse(initialData ?? '{}') as ITask;
  return (
    <AdminLayout>
      <UpdateTaskView task={data} />
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

  if (ctx.query.id !== undefined) {
    const task = await Task.findById(ctx.query.id).exec();
    if (task) {
      return {
        props: {
          initialData: JSON.stringify(task),
        },
      };
    }
  }

  return { props: {} };
}

export const getServerSideProps = withSessionSsr(handler);
