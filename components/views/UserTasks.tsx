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

export interface TaskListViewProps {
  tasks?: Omit<ITask, 'content'>[];
}

export const UserTasksView = ({ tasks }: TaskListViewProps) => {
  return (
    <div className='container mx-auto items-start'>
      <section className='lg:col-span-2 h-full py-6 px-2 sm:p-6 lg:p-8 bg-white sm:rounded-md shadow-sm'>
        <div className='pb-5 border-b border-slate-200 sm:flex sm:items-end sm:justify-between'>
          <h3 className='text-lg leading-6 font-medium text-slate-900'>
            Мои задачи
          </h3>
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
      </section>
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
  console.log(result);
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
