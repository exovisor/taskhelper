import Breadcrumbs from 'components/layouts/Breadcrumbs';
import StackedLayout from 'components/layouts/StackedLayout';
import { UserTasksView } from 'components/views/UserTasks';
import { MAIN_NAV } from 'data/constants';
import { withSessionSsr } from 'lib/auth/session';
import { ITask, Task } from 'lib/schemas/task.schema';
import type { GetServerSidePropsContext, NextPage } from 'next';

export interface TaskPageProps {
  tasksJSON?: string;
}

const TaskPage: NextPage = ({ tasksJSON }: TaskPageProps) => {
  const tasks = JSON.parse(tasksJSON ?? '') as ITask[];
  return (
    <StackedLayout menu={MAIN_NAV} breadcrumbs={localBreadcrumbs()}>
      <UserTasksView tasks={tasks ?? undefined} />
    </StackedLayout>
  );
};

export default TaskPage;

const localBreadcrumbs = (): JSX.Element => (
  <Breadcrumbs
    items={[
      { name: 'Задачи', href: '/tasks', current: false },
      { name: 'Мои задачи', href: '/tasks/my', current: true },
    ]}
  />
);

async function handler(ctx: GetServerSidePropsContext) {
  const user = ctx.req.session.user;

  if (!user) {
    return {
      redirect: '/tasks',
    };
  }

  const tasks = await Task.aggregate([
    {
      $match: { status: 'published', members: user.id },
    },
    {
      $project: {
        content: 0,
      },
    },
    {
      $sort: {
        deadline: 1,
      },
    },
  ]).exec();
  if (!tasks || tasks.length == 0) {
  }

  return { props: { tasksJSON: JSON.stringify(tasks) } };
}

export const getServerSideProps = withSessionSsr(handler);
