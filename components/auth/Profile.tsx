import { Transition, Dialog, Menu } from '@headlessui/react';
import {
  XIcon,
  DotsVerticalIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import useUser from 'lib/hooks/user.hook';
import cn from 'lib/utils/cn';
import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { ApiResponse } from 'lib/utils/api.types';
import {
  IProfile,
  IProfileLink,
  UpdateProfileDto,
} from 'lib/schemas/profile.schema';
import jsonFetcher from 'lib/utils/json.fetcher';

export interface ProfileProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Profile({ open, setOpen }: ProfileProps) {
  const [user] = useUser();
  const { data: profile } = useSWR<ApiResponse<IProfile>>('/api/user');
  const [editMode, setEditMode] = useState(false);

  // const [editLinks, setEditLinks] = useState<IProfileLink[]>(
  //   profile?.success == true && profile.data?.links ? profile.data?.links : [],
  // );

  const [editData, setEditData] = useState<UpdateProfileDto>(
    profile?.success == true
      ? {
          ...profile.data,
        }
      : {},
  );

  if (!user || !profile || profile.success == false) {
    return <></>;
  }

  const data = profile.data;

  const handleSubmit = () => {
    const updateDto = editData;
    const res = jsonFetcher('/api/user', {
      method: 'POST',
      body: JSON.stringify(updateDto),
    });

    res
      .then((data) => {
        console.log('Данные отправлены!');
        console.log(data);
        setEditMode(false);
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  let c = 0;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 overflow-hidden z-50'
        onClose={() => {
          setEditMode(false);
          setOpen(false);
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
                          onClick={() => setOpen(false)}
                        >
                          <span className='sr-only'>Close panel</span>
                          <XIcon className='h-6 w-6' aria-hidden='true' />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Main */}
                  {editMode === false ? (
                    <div>
                      <div className='pb-1 sm:pb-6'>
                        <div className='mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6'>
                          <div className='sm:flex-1 flex items-center justify-between'>
                            <div className='flex items-center'>
                              <div className='flex items-center justify-center mr-2'>
                                {user.photo_url && (
                                  <Image
                                    className='h-10 w-10 rounded-full'
                                    height={40}
                                    width={40}
                                    src={user.photo_url}
                                    alt='Аватар'
                                  />
                                )}
                              </div>
                              <div className='flex flex-col'>
                                <h3 className='font-bold text-xl text-slate-900 sm:text-2xl'>
                                  {data.fullname}
                                </h3>
                                <p className='text-sm text-slate-500'>
                                  @{data.username}
                                </p>
                              </div>
                            </div>
                            <span className='ml-auto inline-flex sm:ml-0'>
                              <Menu
                                as='div'
                                className='relative inline-block text-left'
                              >
                                <Menu.Button className='inline-flex items-center p-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-400 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'>
                                  <span className='sr-only'>Действия</span>
                                  <DotsVerticalIcon
                                    className='h-5 w-5'
                                    aria-hidden='true'
                                  />
                                </Menu.Button>
                                <Transition
                                  as={Fragment}
                                  enter='transition ease-out duration-100'
                                  enterFrom='transform opacity-0 scale-95'
                                  enterTo='transform opacity-100 scale-100'
                                  leave='transition ease-in duration-75'
                                  leaveFrom='transform opacity-100 scale-100'
                                  leaveTo='transform opacity-0 scale-95'
                                >
                                  <Menu.Items className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                    <div className='py-1'>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <a
                                            href='#'
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setEditMode(true);
                                            }}
                                            className={cn(
                                              active
                                                ? 'bg-slate-100 text-slate-900'
                                                : 'text-slate-700',
                                              'block px-4 py-2 text-sm',
                                            )}
                                          >
                                            Редактировать
                                          </a>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          // eslint-disable-next-line @next/next/no-html-link-for-pages
                                          <a
                                            href='/api/auth/logout'
                                            className={cn(
                                              active
                                                ? 'bg-slate-100 text-slate-900'
                                                : 'text-slate-700',
                                              'block px-4 py-2 text-sm',
                                            )}
                                          >
                                            Выйти
                                          </a>
                                        )}
                                      </Menu.Item>
                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='px-4 pt-5 pb-5 sm:px-0 sm:pt-0'>
                        <dl className='space-y-8 px-4 sm:px-6 sm:space-y-6'>
                          {data?.bio && (
                            <div>
                              <dt className='text-sm font-medium text-slate-500 sm:w-40 sm:flex-shrink-0'>
                                О себе
                              </dt>
                              <dd className='mt-1 text-sm text-slate-900 sm:col-span-2'>
                                <p>{data.bio}</p>
                              </dd>
                            </div>
                          )}
                          {data?.phone && (
                            <div>
                              <dt className='text-sm font-medium text-slate-500 sm:w-40 sm:flex-shrink-0'>
                                Телефон
                              </dt>
                              <dd className='mt-1 text-sm text-slate-900 sm:col-span-2'>
                                <p>{data.phone}</p>
                              </dd>
                            </div>
                          )}
                          {data?.email && (
                            <div>
                              <dt className='text-sm font-medium text-slate-500 sm:w-40 sm:flex-shrink-0'>
                                Почта
                              </dt>
                              <dd className='mt-1 text-sm text-slate-900 sm:col-span-2'>
                                <p>{data.email}</p>
                              </dd>
                            </div>
                          )}
                          {data?.links && data.links.length > 0 && (
                            <div>
                              <dt className='text-sm font-medium text-slate-500 sm:w-40 sm:flex-shrink-0'>
                                Ссылки
                              </dt>
                              <dd className='mt-1 text-sm text-slate-900 sm:col-span-2'>
                                <ul>
                                  {data.links.map((l) => (
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
                  ) : (
                    <div>
                      <div className='mt-6 sm:mt-8 px-4 sm:px-6'>
                        <h3 className='font-bold text-xl text-slate-900 sm:text-2xl'>
                          Редактирование
                        </h3>
                      </div>
                      <div className='px-4 pt-5 pb-5 sm:px-0 sm:pt-0 mt-6'>
                        <div className='space-y-8 px-4 sm:px-6 sm:space-y-6'>
                          <div className='mt-1 text-sm text-slate-900 flex flex-col space-y-4'>
                            <div>
                              <label
                                htmlFor='bio'
                                className='block text-sm font-medium text-slate-700'
                              >
                                О себе
                              </label>
                              <div className='mt-1'>
                                <textarea
                                  rows={4}
                                  name='bio'
                                  id='bio'
                                  className='shadow-sm focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-md'
                                  value={editData.bio}
                                  onChange={(event) => {
                                    setEditData({
                                      ...editData,
                                      bio: event.target.value,
                                    });
                                  }}
                                  placeholder='Напишите о себе пару предложений...'
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor='email'
                                className='block text-sm font-medium text-slate-700'
                              >
                                Почта
                              </label>
                              <div className='mt-1 relative rounded-md shadow-sm'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                  <MailIcon
                                    className='h-5 w-5 text-slate-400'
                                    aria-hidden='true'
                                  />
                                </div>
                                <input
                                  type='email'
                                  name='email'
                                  id='email'
                                  className='focus:ring-slate-500 focus:border-slate-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md'
                                  placeholder={
                                    data?.email ?? 'mail@example.com'
                                  }
                                  value={editData.email}
                                  onChange={(event) => {
                                    setEditData({
                                      ...editData,
                                      email: event.target.value,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor='phone'
                                className='block text-sm font-medium text-slate-700'
                              >
                                Телефон
                              </label>
                              <div className='mt-1 relative rounded-md shadow-sm'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                  <PhoneIcon
                                    className='h-5 w-5 text-slate-400'
                                    aria-hidden='true'
                                  />
                                </div>
                                <input
                                  type='text'
                                  name='phone'
                                  id='phone'
                                  className='focus:ring-slate-500 focus:border-slate-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md'
                                  placeholder={
                                    data?.phone ?? '+7 (000) 000-00-00'
                                  }
                                  value={editData.phone}
                                  onChange={(event) => {
                                    setEditData({
                                      ...editData,
                                      phone: event.target.value,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <span className='block text-sm font-medium text-slate-700'>
                                Ссылки
                              </span>
                              <div>
                                {editData.links &&
                                  editData.links.map((el) => (
                                    <div
                                      key={el.name}
                                      className='mt-1 relative flex'
                                    >
                                      <input
                                        type='text'
                                        id={'profile-link-' + el.name}
                                        className='shadow-sm focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-md'
                                        placeholder='Название ресурса'
                                        defaultValue={el.name}
                                        onChange={(event) => {
                                          el.name = event.target.value;
                                        }}
                                      />
                                      <input
                                        type='text'
                                        id={'profile-link-href-' + el.name}
                                        className='shadow-sm focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-md'
                                        placeholder='Ссылка'
                                        defaultValue={el.href}
                                        onChange={(event) => {
                                          el.href = event.target.value;
                                        }}
                                      />
                                      <button
                                        type='button'
                                        onClick={() => {
                                          const links: IProfileLink[] =
                                            editData.links &&
                                            editData.links.length > 0
                                              ? editData.links.filter(
                                                  (l) => l.name !== el.name,
                                                )
                                              : [];
                                          setEditData({
                                            ...editData,
                                            links: links,
                                          });
                                        }}
                                        className='inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
                                      >
                                        <XIcon className='h-5 w-5 text-slate-400' />
                                      </button>
                                    </div>
                                  ))}
                                <button
                                  type='button'
                                  onClick={() => {
                                    const links: IProfileLink[] = editData.links
                                      ? [
                                          ...editData.links,
                                          {
                                            name:
                                              'Новая ссылка ' +
                                              editData.links.length,
                                            href: 'http://link.to',
                                          },
                                        ]
                                      : [
                                          {
                                            name: 'Новая ссылка - 1',
                                            href: 'http://link.to',
                                          },
                                        ];
                                    setEditData({
                                      ...editData,
                                      links: links,
                                    });
                                  }}
                                  className='inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
                                >
                                  <PlusIcon className='h-5 w-5 text-slate-400 mr-2' />
                                  Добавить ссылку
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='mt-6 sm:mt-8 px-4 sm:px-6 flex space-x-2 md:space-x-4'>
                        <button
                          type='button'
                          onClick={() => {
                            setEditMode(false);
                          }}
                          className='inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
                        >
                          Отмена
                        </button>
                        <button
                          type='button'
                          onClick={() => handleSubmit()}
                          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
                        >
                          Сохранить
                        </button>
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
  );
}
