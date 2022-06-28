import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import jsonFetcher from 'lib/utils/json.fetcher';
import moment from 'moment';

function MyApp({ Component, pageProps }: AppProps) {
  moment.locale('ru');
  return (
    <SWRConfig
      value={{
        fetcher: jsonFetcher,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
