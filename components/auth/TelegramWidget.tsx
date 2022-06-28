import { useEffect, useRef, useState } from 'react';

export interface TelegramWidgetProps {
  bot?: string;
  redirectUrl?: string;

  size?: 'large' | 'medium' | 'small';
  radius?: number;

  requestAccess?: boolean;
  showUserPicture?: boolean;
}

// Workaround for "Prop `dangerouslySetInnerHTML` did not match"
export const TelegramWidget = (props: TelegramWidgetProps): JSX.Element => {
  const root = useRef<HTMLDivElement>(null);
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    const host = window.location.host;
    const baseUrl = `http://${host}`;

    setRedirectUrl(`${baseUrl}/api/auth/login`);
  }, []);

  useEffect(() => {
    const node = root.current;
    const script = document.createElement('script');

    script.src = 'https://telegram.org/js/telegram-widget.js?19';
    script.async = true;

    script.setAttribute(
      'data-telegram-login',
      props.bot ?? 'TaskhelperDemoBot',
    );
    script.setAttribute('data-auth-url', props.redirectUrl ?? redirectUrl);
    script.setAttribute('data-size', props.size ?? 'large');
    script.setAttribute('data-radius', props.radius ? '' + props.radius : '8');
    if (props.requestAccess)
      script.setAttribute('data-request-access', 'write');
    if (props.showUserPicture) script.setAttribute('data-userpic', 'false');

    node?.appendChild(script);

    return () => {
      node?.removeChild(script);
    };
  }, [root, props, redirectUrl]);

  return <div ref={root}></div>;
};
