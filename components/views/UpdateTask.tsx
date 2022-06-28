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
  SaveIcon,
  CloudIcon,
  CloudUploadIcon,
  EyeIcon,
  CheckIcon,
  ChevronDownIcon,
  SelectorIcon,
  SortAscendingIcon,
  UsersIcon,
  PlusIcon,
  TagIcon,
} from '@heroicons/react/outline';
import { IProfile } from 'lib/schemas/profile.schema';
import { ITask, TaskStatus, TaskStatusArray } from 'lib/schemas/task.schema';
import dynamic from 'next/dynamic';
import { Fragment, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { Transition, Dialog, Menu, Listbox, Combobox } from '@headlessui/react';
import cn from 'lib/utils/cn';
import user from 'pages/api/user';
import { EDITOR_INIT_DATA } from 'components/editor/initial_data';
import useSWR from 'swr';
import jsonFetcher from 'lib/utils/json.fetcher';
import { useRouter } from 'next/router';
import { Types } from 'mongoose';

export default function UpdateTaskView({
  task,
  setEditMode,
}: {
  task?: ITask;
  setEditMode?: (val: boolean) => any;
}) {
  const [editData, setEditData] = useState<ITask | undefined>(task);

  const { data: categories } = useSWR('/api/tasks/categories');

  const router = useRouter();
  const [tags, setTags] = useState<string[]>(task ? task.tags ?? [] : []);
  const [tag, setTag] = useState<string>('');
  const [title, setTitle] = useState<string>(task ? task.title ?? '' : '');
  const [selectedDate, setSelectedDate] = useState(
    task && task.deadline
      ? moment(task.deadline).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD'),
  );
  const [selectedCategory, setSelectedCategory] = useState(
    task ? task.category : '',
  );

  const [editor, setEditorRef] = useState<EditorJS | null>(null);

  const filterCategories = () => {
    if (categories?.success == true) {
      return selectedCategory === '' || selectedCategory === undefined
        ? categories.data
        : categories.data.filter((category: string) => {
            return category
              .toLowerCase()
              .includes(selectedCategory.toLowerCase());
          });
    }
    return [];
  };

  const saveForm = async () => {
    const content = await editor?.save();
    const description = content.blocks.find(
      (block) => block.type == 'paragraph',
    )?.data.text;

    if (!description) {
      console.log(
        'Cant generate description. Try adding at least 1 paragraph block',
      );
      return;
    }

    const jsonContent = JSON.stringify(content);

    const task: ITask = {
      ...editData,
      description: description as string,
      content: jsonContent,
      tags: tags,
      title: title,
      category: selectedCategory,
      createdAt: new Date(),
      deadline: new Date(selectedDate),
    };

    setEditData(task);

    console.log('Sending data...', task);

    jsonFetcher('/api/tasks/find', {
      method: 'POST',
      body: JSON.stringify(task),
    })
      .then((res) => {
        console.log(res);
        if (!editData?._id) {
          setEditData({
            ...editData,
            _id: res.data.upsertedId,
          });
          router.push('/admin/tasks/' + res.data.upsertedId);
        } else {
          if (setEditMode) {
            setEditMode(false);
          }
        }
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  const filteredCategories = filterCategories();

  return (
    <main className='flex-1'>
      <div className='py-8 xl:py-10'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3'>
          <div className='xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200'>
            <div>
              <div>
                <div className='md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6'>
                  <div className='mt-1 font-bold rounded-md flex-1'>
                    <input
                      type='text'
                      name='title'
                      id='title'
                      className='block w-full border-0 rounded-md bg-gray-50 focus:bg-gray-100 focus:ring-0 text-lg'
                      placeholder='Введите название задачи'
                      value={title}
                      onChange={(event) => {
                        setTitle(event.target.value);
                      }}
                    />
                  </div>
                  <div className='mt-4 flex space-x-3 md:mt-0 items-center'>
                    <button
                      type='button'
                      onClick={() => {
                        (async () => {
                          await saveForm();
                        })();
                      }}
                      className='inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
                    >
                      <CloudUploadIcon
                        className='-ml-1 mr-2 h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                      <span>Сохранить</span>
                    </button>
                  </div>
                </div>
                <div className='py-3 xl:pt-6 xl:pb-0'>
                  <TaskCard
                    setEditorRef={setEditorRef}
                    content={editData?.content}
                  />
                </div>
              </div>
            </div>
          </div>
          <aside className='xl:pl-8'>
            <div className='space-y-5 mt-6'>
              <h3 className='text-sm font-medium text-gray-500'>Статус</h3>
              <div className='flex items-center'>
                <Listbox
                  value={editData ? editData.status : 'draft'}
                  onChange={(v) => {
                    setEditData({
                      ...editData,
                      status: v,
                    });
                  }}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className='sr-only'>Статус</Listbox.Label>
                      <div className='relative'>
                        <div className='inline-flex shadow-sm rounded-md divide-x divide-gray-600'>
                          <div className='relative z-0 inline-flex shadow-sm rounded-md divide-x divide-gray-600'>
                            <div className='relative inline-flex items-center bg-gray-500 py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white'>
                              <CheckIcon
                                className='h-5 w-5'
                                aria-hidden='true'
                              />
                              <p className='ml-2.5 text-sm font-medium'>
                                {editData?.status == 'published'
                                  ? 'Опубликовано'
                                  : editData?.status == 'archived'
                                  ? 'В архиве'
                                  : 'Черновик'}
                              </p>
                            </div>
                            <Listbox.Button className='relative inline-flex items-center bg-gray-500 p-2 rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500'>
                              <ChevronDownIcon
                                className='h-5 w-5 text-white'
                                aria-hidden='true'
                              />
                            </Listbox.Button>
                          </div>
                        </div>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave='transition ease-in duration-100'
                          leaveFrom='opacity-100'
                          leaveTo='opacity-0'
                        >
                          <Listbox.Options className='origin-top-right absolute z-10 right-0 mt-2 w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none'>
                            <Listbox.Option
                              className={({ active }) =>
                                cn(
                                  active
                                    ? 'text-white bg-gray-500'
                                    : 'text-gray-900',
                                  'cursor-default select-none relative p-4 text-sm',
                                )
                              }
                              value={'draft'}
                            >
                              {({ selected, active }) => (
                                <div className='flex flex-col'>
                                  <div className='flex justify-between'>
                                    <p
                                      className={
                                        selected
                                          ? 'font-semibold'
                                          : 'font-normal'
                                      }
                                    >
                                      Черновик
                                    </p>
                                    {selected ? (
                                      <span
                                        className={
                                          active
                                            ? 'text-white'
                                            : 'text-gray-500'
                                        }
                                      >
                                        <CheckIcon
                                          className='h-5 w-5'
                                          aria-hidden='true'
                                        />
                                      </span>
                                    ) : null}
                                  </div>
                                  <p
                                    className={cn(
                                      active
                                        ? 'text-gray-200'
                                        : 'text-gray-500',
                                      'mt-2',
                                    )}
                                  >
                                    Задача будет видна только вам и иметь статус
                                    Черновик. Вы сможете опубликовать её, когда
                                    решите, что она готова.
                                  </p>
                                </div>
                              )}
                            </Listbox.Option>
                            <Listbox.Option
                              className={({ active }) =>
                                cn(
                                  active
                                    ? 'text-white bg-gray-500'
                                    : 'text-gray-900',
                                  'cursor-default select-none relative p-4 text-sm',
                                )
                              }
                              value={'published'}
                            >
                              {({ selected, active }) => (
                                <div className='flex flex-col'>
                                  <div className='flex justify-between'>
                                    <p
                                      className={
                                        selected
                                          ? 'font-semibold'
                                          : 'font-normal'
                                      }
                                    >
                                      Опубликовать
                                    </p>
                                    {selected ? (
                                      <span
                                        className={
                                          active
                                            ? 'text-white'
                                            : 'text-gray-500'
                                        }
                                      >
                                        <CheckIcon
                                          className='h-5 w-5'
                                          aria-hidden='true'
                                        />
                                      </span>
                                    ) : null}
                                  </div>
                                  <p
                                    className={cn(
                                      active
                                        ? 'text-gray-200'
                                        : 'text-gray-500',
                                      'mt-2',
                                    )}
                                  >
                                    Задача будет опубликована и видна всем
                                    участникам сайта.
                                  </p>
                                </div>
                              )}
                            </Listbox.Option>
                            <Listbox.Option
                              className={({ active }) =>
                                cn(
                                  active
                                    ? 'text-white bg-gray-500'
                                    : 'text-gray-900',
                                  'cursor-default select-none relative p-4 text-sm',
                                )
                              }
                              value={'archived'}
                            >
                              {({ selected, active }) => (
                                <div className='flex flex-col'>
                                  <div className='flex justify-between'>
                                    <p
                                      className={
                                        selected
                                          ? 'font-semibold'
                                          : 'font-normal'
                                      }
                                    >
                                      В архиве
                                    </p>
                                    {selected ? (
                                      <span
                                        className={
                                          active
                                            ? 'text-white'
                                            : 'text-gray-500'
                                        }
                                      >
                                        <CheckIcon
                                          className='h-5 w-5'
                                          aria-hidden='true'
                                        />
                                      </span>
                                    ) : null}
                                  </div>
                                  <p
                                    className={cn(
                                      active
                                        ? 'text-gray-200'
                                        : 'text-gray-500',
                                      'mt-2',
                                    )}
                                  >
                                    Задача будет видна только вам. Вы сможете
                                    отредактировать её в любой момент.
                                  </p>
                                </div>
                              )}
                            </Listbox.Option>
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
              <label
                htmlFor='deadline'
                className='block text-sm font-medium text-gray-700'
              >
                Дедлайн
              </label>
              <div className='flex items-center space-x-2'>
                <div className='rounded-md shadow-sm'>
                  <input
                    type='date'
                    name='deadline'
                    id='deadline'
                    className='shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md'
                    placeholder={moment().format('DD.MM.YYYY')}
                    value={selectedDate}
                    onChange={(event) => {
                      setSelectedDate(event.target.value);
                      setEditData({
                        ...editData,
                        deadline: new Date(selectedDate),
                      });
                    }}
                  />
                </div>
              </div>
              <Combobox
                as='div'
                value={selectedCategory}
                onChange={setSelectedCategory}
              >
                <Combobox.Label className='block text-sm font-medium text-gray-700'>
                  Категория
                </Combobox.Label>
                <div className='relative mt-1'>
                  <Combobox.Input
                    className='w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm'
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                    displayValue={(c) => c}
                  />
                  <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                    <SelectorIcon
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </Combobox.Button>

                  {filteredCategories.length > 0 && (
                    <Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                      {filteredCategories.map((c) => (
                        <Combobox.Option
                          key={c}
                          value={c}
                          className={({ active }) =>
                            cn(
                              'relative cursor-default select-none py-2 pl-3 pr-9',
                              active
                                ? 'bg-gray-600 text-white'
                                : 'text-gray-900',
                            )
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span
                                className={cn(
                                  'block truncate',
                                  selected && 'font-semibold',
                                )}
                              >
                                {c}
                              </span>

                              {selected && (
                                <span
                                  className={cn(
                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                    active ? 'text-white' : 'text-gray-600',
                                  )}
                                >
                                  <CheckIcon
                                    className='h-5 w-5'
                                    aria-hidden='true'
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}
                </div>
              </Combobox>
            </div>
            <div className='mt-6 border-t border-gray-200 py-6 space-y-8'>
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Тэги</h3>
                <div>
                  <div className='mt-1 flex rounded-md shadow-sm'>
                    <div className='relative flex items-stretch flex-grow focus-within:z-10'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <TagIcon
                          className='h-5 w-5 text-gray-400'
                          aria-hidden='true'
                        />
                      </div>
                      <input
                        type='text'
                        name='tags'
                        id='tags'
                        className='focus:ring-gray-500 focus:border-gray-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300'
                        placeholder='Название тэга'
                        value={tag}
                        onChange={(event) => {
                          setTag(event.target.value);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            setTags([...tags, tag]);
                            setTag('');
                          }
                        }}
                      />
                    </div>
                    <button
                      type='button'
                      onClick={() => {
                        setTags([...tags, tag]);
                        setTag('');
                      }}
                      className='-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500'
                    >
                      <PlusIcon
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                    </button>
                  </div>
                </div>
                <ul role='list' className='mt-2 leading-8'>
                  {tags.length > 0 &&
                    tags.map((t) => (
                      <li key={t} className='inline mr-2'>
                        <button
                          onClick={() => {
                            setTags(tags.filter((v) => v !== t));
                          }}
                          className='relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5 group'
                        >
                          <div className='absolute flex-shrink-0 flex items-center justify-center'>
                            <span
                              className='h-1.5 w-1.5 rounded-full bg-gray-500 group-hover:hidden'
                              aria-hidden='true'
                            />
                            <span className='text-sm font-medium text-gray-900 hidden group-hover:inline'>
                              x
                            </span>
                          </div>
                          <div className='ml-3.5 text-sm font-medium text-gray-900'>
                            {t}
                          </div>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

const EditorSsrSafe = dynamic(() => import('components/editor/Editor'), {
  ssr: false,
  loading: () => <p>Загружаю редактор...</p>,
});

const TaskCard = ({
  content,
  setEditorRef,
}: {
  content?: string;
  setEditorRef: any;
}) => {
  return (
    <div className='pb-4 lg:pb-6'>
      <EditorSsrSafe
        readOnly={false}
        data={content ? JSON.parse(content) : EDITOR_INIT_DATA}
        setEditorRef={setEditorRef}
      />
    </div>
  );
};
