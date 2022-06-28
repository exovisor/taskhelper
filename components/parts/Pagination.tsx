import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from '@heroicons/react/solid';
import cn from 'lib/utils/cn';
import { MouseEventHandler, useEffect, useState } from 'react';

export interface PaginationProps {
  length: number;
  current?: number;
  perPage?: number;
  onSides?: number;
  changePage: (target: number) => void;
}

export default function Pagination({
  current,
  length,
  perPage,
  onSides,
  changePage,
}: PaginationProps) {
  const cursor = current ?? 1;
  const [pages, setPages] = useState<(number | string)[]>(
    pagination(cursor, Math.ceil(length / (perPage ?? 10))),
  );

  useEffect(() => {
    setPages(pagination(cursor, Math.ceil(length / (perPage ?? 10))));
  }, [cursor, perPage, length]);

  return (
    <nav className='px-4 flex items-center justify-between sm:px-0'>
      <div className='-mt-px w-0 flex-1 flex'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            if (cursor > 1) {
              changePage(cursor - 1);
            }
          }}
          className='border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300'
        >
          <ArrowNarrowLeftIcon
            className='mr-3 h-5 w-5 text-slate-400'
            aria-hidden='true'
          />
          Назад
        </a>
      </div>
      <div className='md:hidden'>
        <a
          href='#'
          className='border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
          aria-current='page'
        >
          {current}
        </a>
      </div>
      <div className='hidden md:-mt-px md:flex'>
        {pages.map((p) =>
          typeof p === 'string' ? (
            <span
              key={p}
              className='border-transparent text-slate-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
            >
              ...
            </span>
          ) : (
            <a
              key={p}
              href='#'
              onClick={(e) => {
                e.preventDefault();
                console.log(pages);
                changePage(p);
              }}
              className={cn(
                cursor == p
                  ? 'border-slate-500 text-slate-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
                'border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium',
              )}
              aria-current='page'
            >
              {p}
            </a>
          ),
        )}
      </div>
      <div className='-mt-px w-0 flex-1 flex justify-end'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            if (cursor < Math.ceil(length / (perPage ?? 10))) {
              changePage(cursor + 1);
            }
          }}
          className='border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300'
        >
          Далее
          <ArrowNarrowRightIcon
            className='ml-3 h-5 w-5 text-slate-400'
            aria-hidden='true'
          />
        </a>
      </div>
    </nav>
  );
}

function pagination(c: number, m: number) {
  let current = c,
    last = m,
    delta = 1,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...' + i);
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}
