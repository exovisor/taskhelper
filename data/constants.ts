import { IPost } from 'lib/schemas/post.shema';
import { ITask } from 'lib/schemas/task.schema';

export const TASK_MOCK: ITask[] = [
  {
    _id: 'test1',

    title: 'Тест задач 1',
    description:
      'Это тестовая заметка, которая была создана при проверке внутренних компонентов. Если вы видите её в продакшене - скорее всего вы запустили приложение в режиме разработчика (или разработчик где-то накосячил)',
    content: '',
    category: 'Отладка',

    createdAt: new Date(),
    deadline: new Date(2022, 7, 5),
    status: 'published',

    members: ['member1', 'member2'],
    tags: [
      'Санкт-Петербург',
      'Специалист',
      'Веб',
      'Angular',
      'NestJS',
      'tag 6',
      'tag 7',
      'tag 8',
      'tag 9',
    ],
  },
  {
    _id: 'test2',

    title: 'Тест задач 2',
    description:
      'Это тестовая заметка, которая была создана при проверке внутренних компонентов. Если вы видите её в продакшене - скорее всего вы запустили приложение в режиме разработчика',
    content: '',
    category: 'Разработка',

    createdAt: new Date(),
    deadline: new Date(2022, 7, 1),
    status: 'published',
  },
];

export const POST_MOCK: IPost[] = [
  {
    _id: 'test1',

    title: 'Тест блога 1',
    description:
      'Это тестовая заметка, которая была создана при проверке внутренних компонентов. Если вы видите её в продакшене - скорее всего вы запустили приложение в режиме разработчика',
    content: '',
    category: 'Полезное',

    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'published',
  },
  {
    _id: 'test2',

    title: 'Тест блога 2',
    description:
      'Это тестовая заметка, которая была создана при проверке внутренних компонентов. Если вы видите её в продакшене - скорее всего вы запустили приложение в режиме разработчика',
    content: '',
    category: 'Курсы',

    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'published',

    tags: [
      'Санкт-Петербург',
      'Специалист',
      'Веб',
      'Angular',
      'NestJS',
      'tag 6',
      'tag 7',
      'tag 8',
      'tag 9',
    ],
  },
];

export const MAIN_NAV = [
  { name: 'Главная', href: '/' },
  { name: 'Задачи', href: '/tasks' },
  { name: 'Блог', href: '/blog' },
];
