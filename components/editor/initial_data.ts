export const EDITOR_INIT_DATA = {
  time: 1556098174501,
  blocks: [
    {
      type: 'header',
      data: {
        text: 'Добавьте заголовок',
        level: 2,
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'И немного текста',
      },
    },
    {
      type: 'header',
      data: {
        text: 'Заголовок списка',
        level: 3,
      },
    },
    {
      type: 'list',
      data: {
        style: 'unordered',
        items: [
          'Первое',
          'Второе',
          'И главное, <code class="inline-code">третье</code>',
        ],
      },
    },
  ],
  version: '2.16.1',
};
