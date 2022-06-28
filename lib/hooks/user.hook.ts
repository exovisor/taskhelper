import { User } from 'lib/auth/session';
import { ApiResponse } from 'lib/utils/api.types';
import Router from 'next/router';
import { useEffect } from 'react';
import useSWR, { KeyedMutator } from 'swr';

export default function useUser({
  redirectTo = '',
  redirectIfFound = false,
} = {}): [User | undefined, KeyedMutator<ApiResponse<User>>] {
  const { data, mutate: mutateUser } = useSWR<ApiResponse<User>>(
    '/api/auth/me',
    {
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    if (!redirectTo || !data || data.success == false) return;

    if ((redirectTo && !redirectIfFound) || redirectIfFound) {
      Router.push(redirectTo);
    }
  }, [data, redirectIfFound, redirectTo]);

  return [data?.success == true ? data.data : undefined, mutateUser];
}
