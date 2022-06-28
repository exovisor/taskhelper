import { Fragment, PropsWithChildren, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon, SearchIcon } from '@heroicons/react/outline';
import cn from 'lib/utils/cn';
import { LayoutProps } from './layout.props';
import { useRouter } from 'next/router';
import Login from 'components/auth/Login';
import Link from 'next/link';
import Image from 'next/image';
import useUser from 'lib/hooks/user.hook';
import Profile from 'components/auth/Profile';

const SearchField = () => (
  <div className='flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end'>
    <div className='max-w-lg w-full lg:max-w-xs'>
      <label htmlFor='search' className='sr-only'>
        Поиск
      </label>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <SearchIcon className='h-5 w-5 text-slate-400' aria-hidden='true' />
        </div>
        <input
          id='search'
          name='search'
          className='block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-slate-700 text-slate-300 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-slate-900 sm:text-sm'
          placeholder='Поиск'
          type='search'
        />
      </div>
    </div>
  </div>
);

export default function StackedLayout({
  menu,
  breadcrumbs,
  children,
}: PropsWithChildren<LayoutProps & { breadcrumbs?: JSX.Element }>) {
  const { pathname } = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user] = useUser();

  const closeLogin = () => {
    setLoginOpen(false);
  };

  return (
    <>
      <Login open={loginOpen} close={closeLogin} />
      <div className='min-h-full'>
        <Disclosure as='nav' className='bg-slate-600'>
          {({ open }) => (
            <>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <Link href='/'>
                        <a className='text-lg text-white font-medium'>
                          <h1>TaskHelper</h1>
                        </a>
                      </Link>
                    </div>
                    <div className='hidden md:block'>
                      <div className='ml-10 flex items-baseline space-x-4'>
                        {menu.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={cn(
                              item.href === pathname
                                ? 'bg-slate-700 text-white'
                                : 'text-white hover:bg-slate-500 hover:bg-opacity-75',
                              'px-3 py-2 rounded-md text-sm font-medium',
                            )}
                            aria-current={
                              item.href === pathname ? 'page' : undefined
                            }
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <SearchField />
                  <div className='hidden md:block'>
                    <div className='ml-4 flex items-center md:ml-6'>
                      {/* Profile dropdown */}
                      {user ? (
                        <>
                          <Menu as='div' className='ml-3 relative'>
                            <div>
                              <Menu.Button className='max-w-xs bg-slate-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-600 focus:ring-white'>
                                <span className='sr-only'>
                                  Открыть меню пользователя
                                </span>
                                {user.photo_url && (
                                  <Image
                                    className='h-8 w-8 rounded-full'
                                    height={32}
                                    width={32}
                                    src={user.photo_url}
                                    alt='Аватар'
                                  />
                                )}
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
                              <Menu.Items className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
                                {user.isAdmin && (
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href='/admin'
                                        className={cn(
                                          active ? 'bg-slate-100' : '',
                                          'block px-4 py-2 text-sm text-slate-700',
                                        )}
                                      >
                                        Панель управления
                                      </a>
                                    )}
                                  </Menu.Item>
                                )}
                                <Menu.Item>
                                  {({ active }) => (
                                    // eslint-disable-next-line @next/next/no-html-link-for-pages
                                    <a
                                      href='/tasks/my'
                                      className={cn(
                                        active ? 'bg-slate-100' : '',
                                        'block px-4 py-2 text-sm text-slate-700',
                                      )}
                                    >
                                      Мои задачи
                                    </a>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href='#'
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setProfileOpen(true);
                                      }}
                                      className={cn(
                                        active ? 'bg-slate-100' : '',
                                        'block px-4 py-2 text-sm text-slate-700',
                                      )}
                                    >
                                      Профиль
                                    </a>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    // eslint-disable-next-line @next/next/no-html-link-for-pages
                                    <a
                                      href='/api/auth/logout'
                                      className={cn(
                                        active ? 'bg-slate-100' : '',
                                        'block px-4 py-2 text-sm text-slate-700',
                                      )}
                                    >
                                      Выход
                                    </a>
                                  )}
                                </Menu.Item>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </>
                      ) : (
                        <div>
                          <button
                            onClick={() => setLoginOpen(true)}
                            className='px-3 py-2 rounded-md text-sm font-medium border border-white text-white hover:bg-slate-500 hover:bg-opacity-75'
                          >
                            Войти
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='-mr-2 flex md:hidden'>
                    {/* Mobile menu button */}
                    <Disclosure.Button className='bg-slate-600 inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-white hover:bg-slate-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-600 focus:ring-white'>
                      <span className='sr-only'>Open main menu</span>
                      {open ? (
                        <XIcon className='block h-6 w-6' aria-hidden='true' />
                      ) : (
                        <MenuIcon
                          className='block h-6 w-6'
                          aria-hidden='true'
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className='md:hidden'>
                <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                  {menu.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as='a'
                      href={item.href}
                      className={cn(
                        item.href === pathname
                          ? 'bg-slate-700 text-white'
                          : 'text-white hover:bg-slate-500 hover:bg-opacity-75',
                        'block px-3 py-2 rounded-md text-base font-medium',
                      )}
                      aria-current={item.href === pathname ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>

                {user ? (
                  <div className='pt-4 pb-3 border-t border-slate-700'>
                    <div className='flex items-center px-5'>
                      <div className='flex-shrink-0'>
                        {user.photo_url && (
                          <Image
                            className='h-8 w-8 rounded-full'
                            height={32}
                            width={32}
                            src={user.photo_url}
                            alt='Аватар'
                          />
                        )}
                      </div>
                      <div className='ml-3'>
                        <div className='text-base font-medium text-white'>
                          {user.first_name + (user.last_name ?? '')}
                        </div>
                        <div className='text-sm font-medium text-slate-300'>
                          @{user.username}
                        </div>
                      </div>
                    </div>
                    <div className='mt-3 px-2 space-y-1'>
                      {user.isAdmin && (
                        <Disclosure.Button
                          as='a'
                          href='/admin/'
                          className='block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-500 hover:bg-opacity-75'
                        >
                          Панель управления
                        </Disclosure.Button>
                      )}
                      <Disclosure.Button
                        as='a'
                        href='/tasks/my'
                        className='block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-500 hover:bg-opacity-75'
                      >
                        Мои задачи
                      </Disclosure.Button>
                      <Disclosure.Button
                        as='a'
                        href='#'
                        onClick={(e: { preventDefault: () => any }) => {
                          e.preventDefault();
                          setProfileOpen(true);
                        }}
                        className='block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-500 hover:bg-opacity-75'
                      >
                        Профиль
                      </Disclosure.Button>
                      <Disclosure.Button
                        as='a'
                        href='/api/auth/logout'
                        className='block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-500 hover:bg-opacity-75'
                      >
                        Выйти
                      </Disclosure.Button>
                    </div>
                  </div>
                ) : (
                  <div className='pt-4 pb-3 border-t border-slate-700'>
                    <div className='px-2 space-y-1'>
                      <Disclosure.Button
                        as='a'
                        onClick={() => setLoginOpen(true)}
                        className='block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-500 hover:bg-opacity-75'
                      >
                        Войти
                      </Disclosure.Button>
                    </div>
                  </div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className='bg-white shadow-sm'>
          <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
            {breadcrumbs ? (
              breadcrumbs
            ) : (
              <h2 className='text-lg leading-6 font-semibold text-slate-900'>
                Главная
              </h2>
            )}
          </div>
        </header>
        <main>
          <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
            {children}
          </div>
        </main>
        <footer>
          <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8'>
            <div className='flex justify-center space-x-6'>
              <p className='text-center text-base text-gray-400'>
                Демо-проект TaskHelper
              </p>
            </div>
            <div className='mt-8 md:mt-0 md:order-1'>
              <p className='text-center text-base text-gray-400'>
                Разработчик -{' '}
                <Link href='https://github.com/Exovisor'>
                  <a className='underline'>Georgii Smirnov</a>
                </Link>
              </p>
            </div>
          </div>
        </footer>
      </div>
      <Profile open={profileOpen} setOpen={setProfileOpen} />
    </>
  );
}
