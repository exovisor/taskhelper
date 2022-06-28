import {
  EmojiSadIcon,
  ClockIcon,
  CalendarIcon,
  HashtagIcon,
} from '@heroicons/react/outline';
import { IPost } from 'lib/schemas/post.shema';
import { ITask } from 'lib/schemas/task.schema';
import moment from 'moment';
import Link from 'next/link';

export interface HomeViewProps {
  tasks?: Omit<ITask, 'content'>[];
  posts?: IPost[];
}

export const HomeView = ({ tasks, posts }: HomeViewProps) => {
  return (
    <div className='container mx-auto py-6 px-2 sm:p-6 lg:p-8 bg-white sm:rounded-md shadow-sm'>
      <div className='pb-5 border-b border-slate-200 sm:flex sm:items-end sm:justify-between'>
        <h3 className='text-lg leading-6 font-medium text-slate-900'>
          Новые задачи
        </h3>
        <div className='mt-3 sm:mt-0 sm:ml-4'>
          <Link href='/tasks'>
            <a className='hidden text-sm font-medium text-slate-700 hover:text-slate-500 md:block'>
              Все задачи<span aria-hidden='true'> &rarr;</span>
            </a>
          </Link>
        </div>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className='grid gap-16 pt-8 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12'>
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
      <div className='mt-12 pb-5 border-b border-slate-200 sm:flex sm:items-end sm:justify-between'>
        <h3 className='text-lg leading-6 font-medium text-slate-900'>
          Последние записи
        </h3>
        <div className='mt-3 sm:mt-0 sm:ml-4'>
          <Link href='/blog'>
            <a className='hidden text-sm font-medium text-slate-700 hover:text-slate-500 md:block'>
              Все публикации<span aria-hidden='true'> &rarr;</span>
            </a>
          </Link>
        </div>
      </div>

      {posts && posts.length > 0 ? (
        <div className='grid gap-16 pt-8 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12'>
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
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
  );
};

const TaskCard = ({ task }: { task: Omit<ITask, 'content'> }) => {
  const daysLeft = moment(task.deadline).diff(moment(), 'days');

  return (
    <div key={task.title}>
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
            <ClockIcon className='h-4 w-4 mr-1' />
            <span>{daysLeft.toLocaleString()} дней</span>
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
            <Link href={'/blog?tag=' + t} key={t}>
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

const PostCard = ({ post }: { post: IPost }) => (
  <div key={post.title}>
    <div>
      <a href={'/blog?category=' + post.category} className='inline-block'>
        <span className='bg-slate-100 text-slate-800 hover:bg-slate-200 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium'>
          {post.category}
        </span>
      </a>
    </div>
    <a href={'/blog/' + post._id} className='mt-2 block group'>
      <p className='group-hover:underline text-xl font-semibold text-slate-900'>
        {post.title}
      </p>
      <div className='mt-2 flex items-center space-x-1 text-sm text-slate-500'>
        <div className='flex flex-space-x-1 items-center'>
          <CalendarIcon className='h-4 w-4 mr-1' />
          <time dateTime={post.createdAt.toISOString()}>
            {moment(post.createdAt).format('DD.MM.YYYY')}
          </time>
        </div>
      </div>
      <p className='mt-3 text-base text-slate-500 line-clamp-4'>
        {post.description}
      </p>
    </a>
    {post.tags && (
      <div className='mt-3 flex items-center flex-wrap text-sm text-slate-500'>
        <HashtagIcon className='w-4 h-4 mr-1' />
        {post.tags.map((t) => (
          <Link href={'/blog?tag=' + t} key={t}>
            <a className='hover:underline mr-2'>
              <span>{t}</span>
            </a>
          </Link>
        ))}
      </div>
    )}
  </div>
);
