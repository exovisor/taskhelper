import {
  EmojiSadIcon,
  ExclamationIcon,
  UserAddIcon,
  UserRemoveIcon,
} from '@heroicons/react/outline';
import { ITask } from 'lib/schemas/task.schema';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Fragment, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import useUser from 'lib/hooks/user.hook';
import { Transition, Dialog } from '@headlessui/react';
import { useRouter } from 'next/router';

export interface TaskViewProps {
  task?: ITask;
}

export const TaskView = ({ task }: TaskViewProps) => {
  const [user] = useUser();
  const daysLeft = moment(task?.deadline).diff(moment(), 'days');
  const [subModal, setSubModal] = useState(false);

  const router = useRouter();

  const cancelButtonRef = useRef(null);

  return (
    <div className='container mx-auto grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8'>
      <section className='lg:col-span-2 h-full py-6 px-2 sm:p-6 lg:p-8 bg-white sm:rounded-md shadow-sm'>
        {task ? (
          <TaskCard task={task} />
        ) : (
          <div className='relative block w-full p-12 text-center'>
            <EmojiSadIcon className='mx-auto h-8 w-8 text-slate-400' />
            <span className='mt-2 block text-sm font-medium text-slate-700'>
              Во время загрузки произошла ошибка
            </span>
          </div>
        )}
      </section>
      <div className='flex flex-col space-y-4 lg:space-y-8 lg:sticky lg:top-4'>
        <section className='py-6 px-2 sm:p-6 lg:p-8 bg-white sm:rounded-md shadow-sm'>
          <div className='pb-5 border-b border-slate-200 sm:flex sm:items-end sm:justify-between'>
            <h3 className='text-lg leading-6 font-medium text-slate-900'>
              Информация
            </h3>
          </div>
          <div>
            <dl className='divide-y divide-slate-200'>
              <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                <dt className='text-sm font-medium text-slate-500'>Создано</dt>
                <dd className='mt-1 flex text-sm text-slate-900 sm:mt-0 sm:col-span-2'>
                  <span className='flex-grow'>
                    {moment(task?.createdAt).format('DD.MM.YYYY')}
                  </span>
                </dd>
              </div>
              <div className='py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4'>
                <dt className='text-sm font-medium text-slate-500'>
                  Окончание
                </dt>
                <dd className='mt-1 flex text-sm text-slate-900 sm:mt-0 sm:col-span-2'>
                  <span className='flex-grow'>
                    {moment(task?.deadline).format('DD.MM.YYYY')}
                  </span>
                </dd>
              </div>
              {daysLeft > 0 && (
                <div className='py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-slate-500'>
                    Осталось
                  </dt>
                  <dd className='mt-1 flex text-sm text-slate-900 sm:mt-0 sm:col-span-2'>
                    <span className='flex-grow'>{daysLeft} дней</span>
                  </dd>
                </div>
              )}
              <div className='py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4'>
                <dt className='text-sm font-medium text-slate-500'>
                  Категория
                </dt>
                <dd className='mt-1 flex text-sm text-slate-900  sm:mt-0 sm:col-span-2 underline'>
                  <Link href={'/tasks?category=' + task?.category}>
                    <a>
                      <span className='flex-grow'>{task?.category}</span>
                    </a>
                  </Link>
                </dd>
              </div>
              {task && task.tags && task.tags.length > 0 && (
                <div className='py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-slate-500'>Теги</dt>
                  <dd className='mt-1 flex flex-wrap text-sm text-slate-900 sm:mt-0 sm:col-span-2'>
                    {task.tags.map((t) => (
                      <Link key={t} href={'/tasks?tag=' + t}>
                        <a className='inline-block mt-2 mr-2'>
                          <span className='bg-slate-100 text-slate-800 hover:bg-slate-200 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium'>
                            {t}
                          </span>
                        </a>
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
              {task?.members && task.members.length > 0 && (
                <div className='py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-slate-500'>
                    Участников
                  </dt>
                  <dd className='mt-1 flex text-sm text-slate-900 sm:mt-0 sm:col-span-2'>
                    <span className='flex-grow'>{task.members.length}</span>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </section>
        {user && task && new Date(task.deadline) > new Date() && (
          <>
            {user && task?.members?.includes(user.id) ? (
              <>
                <button
                  type='button'
                  onClick={() => setSubModal(true)}
                  className='inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
                >
                  <UserRemoveIcon
                    className='-ml-1 mr-3 h-5 w-5'
                    aria-hidden='true'
                  />
                  Отписаться
                </button>
                <Transition.Root show={subModal} as={Fragment}>
                  <Dialog
                    as='div'
                    className='fixed z-10 inset-0 overflow-y-auto'
                    initialFocus={cancelButtonRef}
                    onClose={setSubModal}
                  >
                    <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                      <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                      >
                        <Dialog.Overlay className='fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity' />
                      </Transition.Child>

                      {/* This element is to trick the browser into centering the modal contents. */}
                      <span
                        className='hidden sm:inline-block sm:align-middle sm:h-screen'
                        aria-hidden='true'
                      >
                        &#8203;
                      </span>
                      <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                        enterTo='opacity-100 translate-y-0 sm:scale-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                        leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                      >
                        <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
                          <div className='sm:flex sm:items-start'>
                            <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                              <ExclamationIcon
                                className='h-6 w-6 text-red-600'
                                aria-hidden='true'
                              />
                            </div>
                            <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                              <Dialog.Title
                                as='h3'
                                className='text-lg leading-6 font-medium text-slate-900'
                              >
                                Отписка от задания
                              </Dialog.Title>
                              <div className='mt-2'>
                                <p className='text-sm text-slate-500'>
                                  Вы действительно хотите отписаться от задания?
                                  Вы не будете получать уведомления об
                                  изменениях, но сможете записаться на него
                                  позже.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                            <button
                              type='button'
                              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
                              onClick={() => {
                                router.push(
                                  `/api/tasks/assign?action=unsubscribe&id=${task._id}&redirect=${router.asPath}`,
                                );
                                setSubModal(false);
                              }}
                            >
                              Отписаться
                            </button>
                            <button
                              type='button'
                              className='mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:w-auto sm:text-sm'
                              onClick={() => setSubModal(false)}
                              ref={cancelButtonRef}
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      </Transition.Child>
                    </div>
                  </Dialog>
                </Transition.Root>
              </>
            ) : (
              <button
                type='button'
                onClick={() => {
                  router.push(
                    `/api/tasks/assign?action=subscribe&id=${task._id}&redirect=${router.asPath}`,
                  );
                  setSubModal(false);
                }}
                className='inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
              >
                <UserAddIcon
                  className='-ml-1 mr-3 h-5 w-5'
                  aria-hidden='true'
                />
                Подписаться
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const EditorSsrSafe = dynamic(() => import('components/editor/Editor'), {
  ssr: false,
  loading: () => <p>Загружаю редактор...</p>,
});

const TaskCard = ({ task }: { task: ITask }) => {
  const [editor, setEditorRef] = useState<EditorJS | null>(null);

  return (
    <div key={task.title} className='pb-4 lg:pb-6'>
      <EditorSsrSafe
        readOnly={true}
        data={JSON.parse(task.content)}
        setEditorRef={setEditorRef}
      />
    </div>
  );
};
