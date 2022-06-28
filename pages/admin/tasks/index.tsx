import { Listbox, Menu, Switch, Transition } from '@headlessui/react';
import {
  CheckIcon,
  SelectorIcon,
  ChevronDownIcon,
  ClockIcon,
  HashtagIcon,
  LockClosedIcon,
  EmojiSadIcon,
  ArchiveIcon,
  PencilAltIcon,
  CheckCircleIcon,
} from '@heroicons/react/outline';
import AdminLayout from 'components/layouts/AdminLayout';
import { withSessionSsr } from 'lib/auth/session';
import { ITask, TaskFilters } from 'lib/schemas/task.schema';
import cn from 'lib/utils/cn';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect, Fragment } from 'react';
import { ApiResponse } from 'lib/utils/api.types';
import useSWR from 'swr';
import Link from 'next/link';
import Pagination from 'components/parts/Pagination';
import moment from 'moment';

const sortOptions = [
  { name: 'дате создания', value: 'createdAt' },
  { name: 'дате окончания', value: 'deadline' },
];

export default function AdminTasks() {
  const { query } = useRouter();

  const [filters, setFilters] = useState<TaskFilters>(getFilters(query));

  useEffect(() => {
    setFilters(getFilters(query));
  }, [query]);

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
    <AdminLayout>
      <main className='flex-1'>
        <div className='py-8 xl:py-10'>
          <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3'>
            <div className='xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200'>
              <div>
                <div>
                  <div className='md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6'>
                    <div>
                      <h3 className='text-2xl font-bold text-gray-900'>
                        Список задач
                      </h3>
                      <div className='flex items-center flex-wrap mt-2'>
                        <Menu
                          as='div'
                          className='relative z-10 inline-block text-left mr-4'
                        >
                          <div>
                            <Menu.Button className='group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900'>
                              По{' '}
                              {filters.sortBy &&
                                sortOptions.find(
                                  (o) => o.value === filters.sortBy,
                                )?.name}
                              <ChevronDownIcon
                                className='flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                                aria-hidden='true'
                              />
                            </Menu.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter='transition ease-out duration-100'
                            enterFrom='transform opacity-0 scale-95'
                            enterTo='transform opacity-100 scale-100'
                            leave='transition ease-in duration-75'
                            leaveFrom='transform opacity-100 scale-100'
                            leaveTo='transform opacity-0 scale-95'
                          >
                            <Menu.Items className='origin-top-left absolute left-0 z-10 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                              <div className='py-1'>
                                {sortOptions.map((option) => (
                                  <Menu.Item key={option.name}>
                                    {({ active }) => (
                                      <a
                                        href='#'
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setFilters({
                                            ...filters,
                                            sortBy: option.value,
                                          });
                                        }}
                                        className={cn(
                                          active ? 'bg-gray-100' : '',
                                          'block px-4 py-2 text-sm font-medium text-gray-900',
                                        )}
                                      >
                                        {option.name}
                                      </a>
                                    )}
                                  </Menu.Item>
                                ))}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                        <Menu
                          as='div'
                          className='relative z-10 inline-block text-left mr-2'
                        >
                          <div>
                            <Menu.Button className='group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900'>
                              {filters.sortAsc
                                ? 'По возрастанию'
                                : 'По убыванию'}
                              <ChevronDownIcon
                                className='flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                                aria-hidden='true'
                              />
                            </Menu.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter='transition ease-out duration-100'
                            enterFrom='transform opacity-0 scale-95'
                            enterTo='transform opacity-100 scale-100'
                            leave='transition ease-in duration-75'
                            leaveFrom='transform opacity-100 scale-100'
                            leaveTo='transform opacity-0 scale-95'
                          >
                            <Menu.Items className='origin-top-left absolute left-0 z-10 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                              <div className='py-1'>
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href='#'
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setFilters({
                                          ...filters,
                                          sortAsc: true,
                                        });
                                      }}
                                      className={cn(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm font-medium text-gray-900',
                                      )}
                                    >
                                      По возрастанию
                                    </a>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href='#'
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setFilters({
                                          ...filters,
                                          sortAsc: false,
                                        });
                                      }}
                                      className={cn(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm font-medium text-gray-900',
                                      )}
                                    >
                                      По убыванию
                                    </a>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                        <Switch.Group as='div' className='flex items-center'>
                          <Switch
                            checked={filters.showOutdated ?? false}
                            onChange={() => {
                              setFilters({
                                ...filters,
                                showOutdated: filters.showOutdated
                                  ? !filters.showOutdated
                                  : true,
                              });
                            }}
                            className={cn(
                              filters.showOutdated
                                ? 'bg-gray-600'
                                : 'bg-gray-200',
                              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
                            )}
                          >
                            <span
                              aria-hidden='true'
                              className={cn(
                                filters.showOutdated
                                  ? 'trangray-x-5'
                                  : 'trangray-x-0',
                                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                              )}
                            />
                          </Switch>
                          <Switch.Label as='span' className='ml-3'>
                            <span className='text-sm font-medium text-gray-900'>
                              Закрытые
                            </span>
                          </Switch.Label>
                        </Switch.Group>
                      </div>
                    </div>
                  </div>
                  <div className='py-3 xl:pt-6 xl:pb-0'>
                    {tasks?.success == true && tasks.data.length > 0 ? (
                      <div className='flex flex-col space-y-8 mt-8'>
                        {tasks.data.map((t) => (
                          <TaskCard key={t._id} task={t} />
                        ))}
                      </div>
                    ) : (
                      <div className='relative block w-full p-12 text-center'>
                        <EmojiSadIcon className='mx-auto h-8 w-8 text-slate-400' />
                        <span className='mt-2 block text-sm font-medium text-slate-700'>
                          Мы ничего не смогли найти
                        </span>
                      </div>
                    )}
                  </div>
                  {count?.success == true && count.data > 10 && (
                    <Pagination
                      length={count.data}
                      current={filters.page ? filters.page + 1 : 1}
                      changePage={(p) => {
                        setFilters({
                          ...filters,
                          page: p - 1,
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <aside className='xl:pl-8'>
              <div>
                <Listbox
                  value={filters.type}
                  onChange={(v) => {
                    setFilters({
                      ...filters,
                      type: v,
                    });
                  }}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className='block text-sm font-medium text-gray-500'>
                        Тип
                      </Listbox.Label>
                      <div className='mt-1 relative'>
                        <Listbox.Button className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 sm:text-sm'>
                          <span className='block truncate'>
                            {filters.type === 'draft'
                              ? 'Черновик'
                              : filters.type === 'archived'
                              ? 'Архив'
                              : 'Опубликованные'}
                          </span>
                          <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                            <SelectorIcon
                              className='h-5 w-5 text-gray-400'
                              aria-hidden='true'
                            />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave='transition ease-in duration-100'
                          leaveFrom='opacity-100'
                          leaveTo='opacity-0'
                        >
                          <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                            <Listbox.Option
                              className={({ active }) =>
                                cn(
                                  active
                                    ? 'text-white bg-gray-600'
                                    : 'text-gray-900',
                                  'cursor-default select-none relative py-2 pl-8 pr-4',
                                )
                              }
                              value={'draft'}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={cn(
                                      selected
                                        ? 'font-semibold'
                                        : 'font-normal',
                                      'block truncate',
                                    )}
                                  >
                                    Черновик
                                  </span>

                                  {selected ? (
                                    <span
                                      className={cn(
                                        active ? 'text-white' : 'text-gray-600',
                                        'absolute inset-y-0 left-0 flex items-center pl-1.5',
                                      )}
                                    >
                                      <CheckIcon
                                        className='h-5 w-5'
                                        aria-hidden='true'
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                            <Listbox.Option
                              className={({ active }) =>
                                cn(
                                  active
                                    ? 'text-white bg-gray-600'
                                    : 'text-gray-900',
                                  'cursor-default select-none relative py-2 pl-8 pr-4',
                                )
                              }
                              value={'published'}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={cn(
                                      selected
                                        ? 'font-semibold'
                                        : 'font-normal',
                                      'block truncate',
                                    )}
                                  >
                                    Опубликованные
                                  </span>

                                  {selected ? (
                                    <span
                                      className={cn(
                                        active ? 'text-white' : 'text-gray-600',
                                        'absolute inset-y-0 left-0 flex items-center pl-1.5',
                                      )}
                                    >
                                      <CheckIcon
                                        className='h-5 w-5'
                                        aria-hidden='true'
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                            <Listbox.Option
                              className={({ active }) =>
                                cn(
                                  active
                                    ? 'text-white bg-gray-600'
                                    : 'text-gray-900',
                                  'cursor-default select-none relative py-2 pl-8 pr-4',
                                )
                              }
                              value={'archived'}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={cn(
                                      selected
                                        ? 'font-semibold'
                                        : 'font-normal',
                                      'block truncate',
                                    )}
                                  >
                                    Архивированные
                                  </span>

                                  {selected ? (
                                    <span
                                      className={cn(
                                        active ? 'text-white' : 'text-gray-600',
                                        'absolute inset-y-0 left-0 flex items-center pl-1.5',
                                      )}
                                    >
                                      <CheckIcon
                                        className='h-5 w-5'
                                        aria-hidden='true'
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
              <div className='mt-6'>
                <h2 className='text-sm font-medium text-gray-500'>Категории</h2>
                {categories?.success == true && categories.data.length > 0 && (
                  <ul>
                    {categories.data.map((c) => (
                      <li
                        key={c}
                        className='text-gray-800 font-medium hover:text-gray-500'
                      >
                        <Link href={'/admin/tasks?category=' + c}>
                          <a className='inline-block mt-2 mr-2'>{c}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className='mt-6'>
                <div className='flex justify-between'>
                  <h2 className='text-sm font-medium text-gray-500'>Тэги</h2>
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setFilters({
                        ...filters,
                        tag: [],
                      });
                    }}
                    className='underline text-sm font-medium text-gray-700 hover:text-gray-500'
                  >
                    Очистить теги
                  </a>
                </div>
                {tags?.success == true && tags.data.length > 0 && (
                  <div className='mt-3 flex flex-wrap'>
                    {tags.data.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setFilters({
                            ...filters,
                            tag: uniqTags(filters.tag, t),
                          });
                        }}
                        className='inline-block mt-2 mr-2'
                      >
                        <span
                          className={cn(
                            filters.tag?.includes(t)
                              ? 'bg-gray-700 text-gray-200 hover:bg-gray-500'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                            'inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium',
                          )}
                        >
                          {t}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}

export const getServerSideProps = withSessionSsr(
  (ctx: GetServerSidePropsContext) => {
    const user = ctx.req.session.user;

    if (!user || user.isAdmin == false) {
      return {
        notFound: true,
      };
    }
    return {
      props: {},
    };
  },
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

function uniqTags(
  source: string[] | undefined,
  value: string,
): string[] | undefined {
  if (!source) {
    return [value];
  }

  const entry = source.indexOf(value);
  if (entry > -1) {
    const newArr = [...source];
    newArr.splice(entry, 1);
    return newArr;
  }

  const newArr = source.concat(value);

  const map = new Map();
  for (const item of newArr) {
    map.set(item, item);
  }
  const result = Array.from(map.keys());
  return result.length > 0 ? result : undefined;
}

function getQueryString(handler: string, filters: TaskFilters): string {
  let str = `/api/tasks/${handler}?`;
  str += 'limit=' + (filters.limit ?? 10);
  str += '&page=' + (filters.page ?? 0);
  str += filters.category ? '&category=' + filters.category : '';
  str += filters.sortAsc ? '&sortAsc=true' : '';
  str += '&sortBy=' + (filters.sortBy ?? 'createdAt');
  str += filters.showOutdated ? '&showOutdated=true' : '';
  str += filters.tag && filters.tag.length > 0 ? '&tags=' + filters.tag : '';
  str += filters.type ? '&type=' + filters.type : '';

  return str;
}

const TaskCard = ({ task }: { task: Omit<ITask, 'content'> }) => {
  const daysLeft = moment(task.deadline).diff(moment(), 'days');

  return (
    <div key={task.title} className='border-b border-gray-200 pb-4 lg:pb-6'>
      <div>
        <a
          href={'/admin/tasks?category=' + task.category}
          className='inline-block'
        >
          <span className='bg-gray-100 text-gray-800 hover:bg-gray-200 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium'>
            {task.category}
          </span>
        </a>
      </div>
      <a href={'/admin/tasks/' + task._id} className='mt-2 block group'>
        <p className='text-xl font-semibold group-hover:underline text-gray-900'>
          {task.title}
        </p>
        <div className='mt-2 flex items-center space-x-1 text-sm text-gray-500'>
          <div className='flex flex-space-x-1 items-center'>
            {daysLeft > 0 ? (
              <>
                <ClockIcon className='h-4 w-4 mr-1' />
                <span>{daysLeft.toLocaleString()} дней</span>
              </>
            ) : (
              <>
                <LockClosedIcon className='h-4 w-4 mr-1' />
                <span>
                  Закрыто {moment(task.deadline).format('DD.MM.YYYY')}
                </span>
              </>
            )}
          </div>

          {task.status && (
            <>
              <span aria-hidden='true'>&middot;</span>
              <span>
                {task.status == 'published' ? (
                  <div className='flex items-center'>
                    <CheckCircleIcon className='h-4 w-4 mr-1' /> Опубликовано
                  </div>
                ) : task.status == 'archived' ? (
                  <div className='flex items-center'>
                    <ArchiveIcon className='h-4 w-4 mr-1' /> В архиве
                  </div>
                ) : (
                  <div className='flex items-center'>
                    <PencilAltIcon className='h-4 w-4 mr-1' /> В черновике
                  </div>
                )}
              </span>
            </>
          )}
          {task.members && task.members.length > 0 && (
            <>
              <span aria-hidden='true'>&middot;</span>
              <span>{task.members.length} участников</span>
            </>
          )}
        </div>
        <p className='mt-3 text-base text-gray-500 line-clamp-4'>
          {task.description}
        </p>
      </a>
      {task.tags && task.tags.length > 0 && (
        <div className='mt-3 flex items-center flex-wrap text-sm text-gray-500'>
          <HashtagIcon className='w-4 h-4 mr-1' />
          {task.tags.map((t) => (
            <Link href={'/admin/tasks?tags=' + t} key={t}>
              <a className='hover:underline mr-2'>
                <span>{t}</span>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
