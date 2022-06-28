import { Menu, Switch, Transition } from '@headlessui/react';
import {
  LockClosedIcon,
  ChevronDownIcon,
  ClockIcon,
  EmojiSadIcon,
  HashtagIcon,
} from '@heroicons/react/outline';
import Pagination from 'components/parts/Pagination';
import { ITask, TaskFilters } from 'lib/schemas/task.schema';
import cn from 'lib/utils/cn';
import moment from 'moment';
import Link from 'next/link';
import { Fragment } from 'react';

const sortOptions = [
  { name: 'дате создания', value: 'createdAt' },
  { name: 'дате окончания', value: 'deadline' },
];

export interface TaskListViewProps {
  tasks?: Omit<ITask, 'content'>[];
  filters: TaskFilters;
  setFilters: (new_state: TaskFilters) => void;

  categories?: string[];
  tags?: string[];

  taskCounter: number;
}

export const TaskListView = ({
  tasks,
  filters,
  setFilters,
  categories,
  tags,
  taskCounter,
}: TaskListViewProps) => {
  return (
    <div className='container mx-auto grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8'>
      <section className='lg:col-span-2 h-full py-6 px-2 sm:p-6 lg:p-8 bg-white sm:rounded-md shadow-sm'>
        <div className='pb-5 border-b border-slate-200 sm:flex sm:items-end sm:justify-between'>
          <h3 className='text-lg leading-6 font-medium text-slate-900'>
            Список задач
          </h3>
          <div className='flex flex-col items-end justify-between'>
            <div className='flex items-center flex-wrap'>
              <Menu
                as='div'
                className='relative z-10 inline-block text-left mr-4'
              >
                <div>
                  <Menu.Button className='group inline-flex justify-center text-sm font-medium text-slate-700 hover:text-slate-900'>
                    По{' '}
                    {filters.sortBy &&
                      sortOptions.find((o) => o.value === filters.sortBy)?.name}
                    <ChevronDownIcon
                      className='flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-slate-400 group-hover:text-slate-500'
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
                                active ? 'bg-slate-100' : '',
                                'block px-4 py-2 text-sm font-medium text-slate-900',
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
                  <Menu.Button className='group inline-flex justify-center text-sm font-medium text-slate-700 hover:text-slate-900'>
                    {filters.sortAsc ? 'По возрастанию' : 'По убыванию'}
                    <ChevronDownIcon
                      className='flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-slate-400 group-hover:text-slate-500'
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
                              active ? 'bg-slate-100' : '',
                              'block px-4 py-2 text-sm font-medium text-slate-900',
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
                              active ? 'bg-slate-100' : '',
                              'block px-4 py-2 text-sm font-medium text-slate-900',
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
                    filters.showOutdated ? 'bg-slate-600' : 'bg-slate-200',
                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500',
                  )}
                >
                  <span
                    aria-hidden='true'
                    className={cn(
                      filters.showOutdated ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                    )}
                  />
                </Switch>
                <Switch.Label as='span' className='ml-3'>
                  <span className='text-sm font-medium text-slate-900'>
                    Закрытые
                  </span>
                </Switch.Label>
              </Switch.Group>
            </div>
          </div>
        </div>
        {tasks && tasks.length > 0 ? (
          <div className='flex flex-col space-y-8 mt-8'>
            {tasks.map((t) => (
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
        {taskCounter > 10 && (
          <Pagination
            length={taskCounter}
            current={filters.page ? filters.page + 1 : 1}
            changePage={(p) => {
              setFilters({
                ...filters,
                page: p - 1,
              });
            }}
          />
        )}
      </section>
      <div className='flex flex-col space-y-4 lg:space-y-8 lg:sticky lg:top-4'>
        <section className='py-6 px-2 sm:p-6 lg:p-8 bg-white sm:rounded-md shadow-sm'>
          <div className='pb-5 border-b border-slate-200 sm:flex sm:items-end sm:justify-between'>
            <h3 className='text-lg leading-6 font-medium text-slate-900'>
              Категории
            </h3>
            <div className='mt-3 sm:mt-0 sm:ml-4'>
              <Link href='/tasks'>
                <a className='hidden text-sm font-medium text-slate-700 hover:text-slate-500 md:block'>
                  Показать все
                </a>
              </Link>
            </div>
          </div>
          {categories && categories.length > 0 && (
            <ul className='mt-3'>
              {categories.map((c) => (
                <li
                  key={c}
                  className='text-slate-800 font-medium hover:text-slate-500'
                >
                  <Link href={'/tasks?category=' + c}>
                    <a className='inline-block mt-2 mr-2'>{c}</a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className='py-6 px-2 sm:p-6 lg:p-8 bg-white sm:rounded-md shadow-sm'>
          <div className='pb-5 border-b border-slate-200 sm:flex sm:items-end sm:justify-between'>
            <h3 className='text-lg leading-6 font-medium text-slate-900'>
              Теги
            </h3>
            <div className='mt-3 sm:mt-0 sm:ml-4'>
              <a
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  setFilters({
                    ...filters,
                    tag: [],
                  });
                }}
                className='text-sm font-medium text-slate-700 hover:text-slate-500'
              >
                Очистить теги
              </a>
            </div>
          </div>

          {tags && tags.length > 0 && (
            <div className='mt-3 flex flex-wrap'>
              {tags.map((t) => (
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
                        ? 'bg-slate-700 text-slate-200 hover:bg-slate-500'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
                      'inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium',
                    )}
                  >
                    {t}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
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

const TaskCard = ({ task }: { task: Omit<ITask, 'content'> }) => {
  const daysLeft = moment(task.deadline).diff(moment(), 'days');

  return (
    <div key={task.title} className='border-b border-slate-200 pb-4 lg:pb-6'>
      <div>
        <a href={'/tasks?category=' + task.category} className='inline-block'>
          <span className='bg-slate-100 text-slate-800 hover:bg-slate-200 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium'>
            {task.category}
          </span>
        </a>
      </div>
      <a href={'/tasks/' + task._id} className='mt-2 block group'>
        <p className='text-xl font-semibold group-hover:underline text-slate-900'>
          {task.title}
        </p>
        <div className='mt-2 flex items-center space-x-1 text-sm text-slate-500'>
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
          {task.members && task.members.length > 0 && (
            <>
              <span aria-hidden='true'>&middot;</span>
              <span>{task.members.length} участников</span>
            </>
          )}
        </div>
        <p className='mt-3 text-base text-slate-500 line-clamp-4'>
          {task.description}
        </p>
      </a>
      {task.tags && task.tags.length > 0 && (
        <div className='mt-3 flex items-center flex-wrap text-sm text-slate-500'>
          <HashtagIcon className='w-4 h-4 mr-1' />
          {task.tags.map((t) => (
            <Link href={'/tasks?tags=' + t} key={t}>
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
