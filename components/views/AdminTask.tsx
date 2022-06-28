import {
  PencilIcon,
  BellIcon,
  LockOpenIcon,
  ChatAltIcon,
  CalendarIcon,
  ArchiveIcon,
  PencilAltIcon,
  FolderIcon,
  DotsVerticalIcon,
  XIcon,
  ClockIcon,
} from '@heroicons/react/outline';
import { IProfile } from 'lib/schemas/profile.schema';
import { ITask } from 'lib/schemas/task.schema';
import dynamic from 'next/dynamic';
import { Fragment, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { Transition, Dialog, Menu } from '@headlessui/react';
import cn from 'lib/utils/cn';
import user from 'pages/api/user';
import { useRouter } from 'next/router';

export default function AdminTaskView({
  task,
  setEditMode,
}: {
  task: Omit<ITask, 'members'> & {
    members: IProfile[];
  };
  setEditMode?: (val: boolean) => any;
}) {
  const [editUser, setEditUser] = useState<IProfile | null>(null);
  const router = useRouter();

  return (
    <main className='flex-1'>
      <div className='py-8 xl:py-10'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3'>
          <div className='xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200'>
            <div>
              <div>
                <div className='md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6'>
                  <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                      {task.title}
                    </h1>
                  </div>
                  <div className='mt-4 flex space-x-3 md:mt-0'>
                    <a
                      href={'/admin/tasks/edit?id=' + task._id}
                      className='inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
                    >
                      <PencilIcon
                        className='-ml-1 mr-2 h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                      <span>Редактировать</span>
                    </a>
                  </div>
                </div>
                <div className='py-3 xl:pt-6 xl:pb-0'>
                  <TaskCard content={task.content ?? ''} />
                </div>
              </div>
            </div>
          </div>
          <aside className='xl:pl-8'>
            <h3 className='text-sm text-gray-500 font-medium'>Информация</h3>
            <div className='space-y-5 mt-6'>
              {task.status == 'published' && (
                <div className='flex items-center space-x-2'>
                  {moment(task.deadline).diff(moment(), 'days') > 0 ? (
                    <>
                      <LockOpenIcon
                        className='h-5 w-5 text-green-500'
                        aria-hidden='true'
                      />
                      <span className='text-green-700 text-sm font-medium'>
                        Доступно
                      </span>
                    </>
                  ) : (
                    <>
                      <LockOpenIcon
                        className='h-5 w-5 text-red-500'
                        aria-hidden='true'
                      />
                      <span className='text-red-700 text-sm font-medium'>
                        Истекло
                      </span>
                    </>
                  )}
                </div>
              )}
              {task.status == 'archived' && (
                <div className='flex items-center space-x-2'>
                  <ArchiveIcon
                    className='h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                  <span className='text-gray-700 text-sm font-medium'>
                    В архиве
                  </span>
                </div>
              )}
              {task.status == 'draft' && (
                <div className='flex items-center space-x-2'>
                  <PencilAltIcon
                    className='h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                  <span className='text-gray-700 text-sm font-medium'>
                    Черновик
                  </span>
                </div>
              )}
              <div className='flex items-center space-x-2'>
                <FolderIcon
                  className='h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
                <span className='text-gray-900 text-sm font-medium'>
                  <Link href={'/admin/tasks?category=' + task.category}>
                    <a className='underline'>{task.category}</a>
                  </Link>
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <CalendarIcon
                  className='h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
                <span className='text-gray-700 text-sm font-medium'>
                  Создано {moment(task.createdAt).format('DD.MM.YYYY')}
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <ClockIcon
                  className='h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
                <span className='text-gray-700 text-sm font-medium'>
                  Закроется {moment(task.deadline).format('DD.MM.YYYY')}
                </span>
              </div>
            </div>
            <div className='mt-6 border-t border-gray-200 py-6 space-y-8'>
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Тэги</h3>
                <ul role='list' className='mt-2 leading-8'>
                  {task.tags &&
                    task.tags.length > 0 &&
                    task.tags.map((t) => (
                      <li key={t} className='inline mr-2'>
                        <Link href={'/admin/tasks?tags=' + t}>
                          <a className='relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5'>
                            <div className='absolute flex-shrink-0 flex items-center justify-center'>
                              <span
                                className='h-1.5 w-1.5 rounded-full bg-gray-500'
                                aria-hidden='true'
                              />
                            </div>
                            <div className='ml-3.5 text-sm font-medium text-gray-900'>
                              {t}
                            </div>
                          </a>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Участники</h3>
                <ul role='list' className='mt-3 space-y-3'>
                  {task.members &&
                    task.members.length > 0 &&
                    task.members.map((m) => (
                      <li key={m.telegramId} className='flex justify-start'>
                        <a
                          href='#'
                          onClick={(e) => {
                            e.preventDefault();
                            setEditUser(m);
                          }}
                          className='flex items-center space-x-3'
                        >
                          <div className='flex-shrink-0 flex items-center justify-center'>
                            <Image
                              className='h-8 w-8 rounded-full'
                              height={32}
                              width={32}
                              src={m.photo_url}
                              alt=''
                            />
                          </div>
                          <div className='text-sm font-medium text-gray-900'>
                            {m.fullname + ' '}
                            <span className='text-gray-500'>@{m.username}</span>
                          </div>
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Transition.Root show={editUser !== null} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 overflow-hidden z-50'
          onClose={() => {
            setEditUser(null);
          }}
        >
          <div className='absolute inset-0 overflow-hidden'>
            <Dialog.Overlay className='absolute inset-0' />

            <div className='fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'
              >
                <div className='w-screen max-w-md'>
                  <div className='h-full flex flex-col bg-white shadow-xl overflow-y-scroll'>
                    <div className='px-4 py-6 sm:px-6'>
                      <div className='flex items-start justify-between'>
                        <h2
                          id='slide-over-heading'
                          className='text-lg font-medium text-slate-900'
                        >
                          Профиль
                        </h2>
                        <div className='ml-3 h-7 flex items-center'>
                          <button
                            type='button'
                            className='bg-white rounded-md text-slate-400 hover:text-slate-500 focus:ring-2 focus:ring-slate-500'
                            onClick={() => setEditUser(null)}
                          >
                            <span className='sr-only'>Close panel</span>
                            <XIcon className='h-6 w-6' aria-hidden='true' />
                          </button>
                        </div>
                      </div>
                    </div>
                    {editUser !== null && (
                      <div>
                        <div className='pb-1 sm:pb-6'>
                          <div className='mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6'>
                            <div className='sm:flex-1 flex items-center justify-between'>
                              <div className='flex items-center'>
                                <div className='flex items-center justify-center mr-2'>
                                  {editUser.photo_url && (
                                    <Image
                                      className='h-10 w-10 rounded-full'
                                      height={40}
                                      width={40}
                                      src={editUser.photo_url}
                                      alt='Аватар'
                                    />
                                  )}
                                </div>
                                <div className='flex flex-col'>
                                  <h3 className='font-bold text-xl text-slate-900 sm:text-2xl'>
                                    {editUser.fullname}
                                  </h3>
                                  <p className='text-sm text-slate-500'>
                                    @{editUser.username}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='px-4 pt-5 pb-5 sm:px-0 sm:pt-0'>
                          <dl className='space-y-8 px-4 sm:px-6 sm:space-y-6'>
                            {editUser?.bio && (
                              <div>
                                <dt className='text-sm font-medium text-slate-500 sm:w-40 sm:flex-shrink-0'>
                                  О себе
                                </dt>
                                <dd className='mt-1 text-sm text-slate-900 sm:col-span-2'>
                                  <p>{editUser.bio}</p>
                                </dd>
                              </div>
                            )}
                            {editUser?.phone && (
                              <div>
                                <dt className='text-sm font-medium text-slate-500 sm:w-40 sm:flex-shrink-0'>
                                  Телефон
                                </dt>
                                <dd className='mt-1 text-sm text-slate-900 sm:col-span-2'>
                                  <p>{editUser.phone}</p>
                                </dd>
                              </div>
                            )}
                            {editUser?.email && (
                              <div>
                                <dt className='text-sm font-medium text-slate-500 sm:w-40 sm:flex-shrink-0'>
                                  Почта
                                </dt>
                                <dd className='mt-1 text-sm text-slate-900 sm:col-span-2'>
                                  <p>{editUser.email}</p>
                                </dd>
                              </div>
                            )}
                            {editUser?.links && editUser.links.length > 0 && (
                              <div>
                                <dt className='text-sm font-medium text-slate-500 sm:w-40 sm:flex-shrink-0'>
                                  Ссылки
                                </dt>
                                <dd className='mt-1 text-sm text-slate-900 sm:col-span-2'>
                                  <ul>
                                    {editUser.links.map((l) => (
                                      <li key={l.name}>
                                        {l.name}:{' '}
                                        <Link href={l.href}>
                                          <a className='underline'>{l.href}</a>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </main>
  );
}

const EditorSsrSafe = dynamic(() => import('components/editor/Editor'), {
  ssr: false,
  loading: () => <p>Загружаю редактор...</p>,
});

const TaskCard = ({
  content,
  readOnly,
}: {
  content: string;
  readOnly?: boolean;
}) => {
  const [editor, setEditorRef] = useState<EditorJS | null>(null);

  return (
    <div className='pb-4 lg:pb-6'>
      <EditorSsrSafe
        readOnly={readOnly ?? true}
        data={JSON.parse(content)}
        setEditorRef={setEditorRef}
      />
    </div>
  );
};
