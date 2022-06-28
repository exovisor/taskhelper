import StackedLayout from 'components/layouts/StackedLayout';
import { HomeView } from 'components/views/Home';
import { MAIN_NAV, POST_MOCK } from 'data/constants';
import { ITask } from 'lib/schemas/task.schema';
import { ApiResponse } from 'lib/utils/api.types';
import type { NextPage } from 'next';
import useSWR from 'swr';

const Home: NextPage = () => {
  const { data: tasks } = useSWR<ApiResponse<Omit<ITask, 'content'>[]>>(
    '/api/tasks/find?limit=6',
  );

  return (
    <StackedLayout menu={MAIN_NAV}>
      <HomeView
        tasks={tasks?.success == true ? tasks.data : undefined}
        posts={POST_MOCK}
      />
    </StackedLayout>
  );
};

export default Home;
