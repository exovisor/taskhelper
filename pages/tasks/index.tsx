import Breadcrumbs from 'components/layouts/Breadcrumbs';
import { Breadcrumb } from 'components/layouts/layout.props';
import StackedLayout from 'components/layouts/StackedLayout';
import { TaskListView } from 'components/views/TaskList';
import { MAIN_NAV, TASK_MOCK } from 'data/constants';
import { ITask, TaskFilters } from 'lib/schemas/task.schema';
import { ApiResponse } from 'lib/utils/api.types';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const TaskList: NextPage = () => {
  const { query } = useRouter();

  const [filters, setFilters] = useState<TaskFilters>(getFilters(query));
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>(
    getBreadcrumbs(filters),
  );

  useEffect(() => {
    setFilters(getFilters(query));
  }, [query]);

  useEffect(() => {
    setBreadcrumbs(getBreadcrumbs(filters));
  }, [filters]);

  // Fetch data
  const { data: tags } = useSWR<ApiResponse<string[]>>('/api/tasks/tags');
  const { data: categories } = useSWR<ApiResponse<string[]>>(
    '/api/tasks/categories',
  );

  const { data: count } = useSWR<ApiResponse<number>>(
    getQueryString('count', filters),
  );

  const { data: tasks } = useSWR<ApiResponse<Omit<ITask, 'content'>[]>>(
    getQueryString('find', filters),
  );

  return (
    <StackedLayout menu={MAIN_NAV} breadcrumbs={localBreadcrumbs(breadcrumbs)}>
      <TaskListView
        tasks={tasks?.success == true ? tasks.data : undefined}
        filters={filters}
        setFilters={setFilters}
        categories={categories?.success == true ? categories.data : undefined}
        tags={tags?.success == true ? tags.data : undefined}
        taskCounter={count?.success == true ? count.data : 0}
      />
    </StackedLayout>
  );
};

export default TaskList;

const localBreadcrumbs = (list: Breadcrumb[]): JSX.Element => (
  <Breadcrumbs items={list} />
);

const getFilters = (query: {
  [key: string]: string | string[] | undefined;
}): TaskFilters => {
  return {
    limit: query.limit ? Number(query.limit) : 10,
    page: query.page ? Number(query.page) : 0,

    sortBy: (query.sortby as string) ?? 'createdAt',
    sortAsc: query.sortasc ? true : false,

    category: (query.category as string) ?? undefined,
    tag: query.tag ? (query.tag as string).split(',') : undefined,
  };
};

const getBreadcrumbs = (filters: TaskFilters) => {
  const crumbs: Breadcrumb[] = [
    {
      name: 'Задачи',
      href: '/tasks',
      current: false,
    },
  ];

  if (filters.category) {
    crumbs.push({
      name: filters.category,
      href: '/tasks?category=' + filters.category,
      current: true,
    });
  } else {
    crumbs[0].current = true;
  }

  return crumbs;
};

function getQueryString(handler: string, filters: TaskFilters): string {
  let str = `/api/tasks/${handler}?`;
  str += 'limit=' + (filters.limit ?? 10);
  str += '&page=' + (filters.page ?? 0);
  str += filters.category ? '&category=' + filters.category : '';
  str += filters.sortAsc ? '&sortAsc=true' : '';
  str += '&sortBy=' + (filters.sortBy ?? 'createdAt');
  str += filters.showOutdated ? '&showOutdated=true' : '';
  str += filters.tag && filters.tag.length > 0 ? '&tags=' + filters.tag : '';

  return str;
}
