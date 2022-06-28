import Breadcrumbs from 'components/layouts/Breadcrumbs';
import StackedLayout from 'components/layouts/StackedLayout';
import { TaskView } from 'components/views/Task';
import { MAIN_NAV } from 'data/constants';
import { ITask, Task } from 'lib/schemas/task.schema';
import { ApiResponse } from 'lib/utils/api.types';
import { Types } from 'mongoose';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';

export interface TaskPageProps {
  taskJSON?: string;
}

const TaskPage: NextPage = ({ taskJSON }: TaskPageProps) => {
  const task = JSON.parse(taskJSON ?? '') as ITask;
  return (
    <StackedLayout
      menu={MAIN_NAV}
      breadcrumbs={
        task ? (
          localBreadcrumbs(task.title, '/tasks/' + task._id, task.category)
        ) : (
          <p>Загрузка...</p>
        )
      }
    >
      <TaskView task={task ?? undefined} />
    </StackedLayout>
  );
};

export default TaskPage;

const localBreadcrumbs = (
  name: string,
  value: string,
  category: string,
): JSX.Element => (
  <Breadcrumbs
    items={[
      { name: 'Задачи', href: '/tasks', current: false },
      { name: category, href: '/tasks?category=' + category, current: false },
      { name: name, href: value, current: true },
    ]}
  />
);

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const id = (ctx.query.id as string) ?? '';
  if (id == undefined || id == '') {
    return {
      notFound: true,
    };
  }
  const oid = new Types.ObjectId(id);

  const task = await Task.findOne({
    _id: oid,
    status: 'published',
  }).exec();
  if (!task) {
    return {
      notFound: true,
    };
  }

  return { props: { taskJSON: JSON.stringify(task) } };
}
