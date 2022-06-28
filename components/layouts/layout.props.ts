import { CheckCircleIcon } from '@heroicons/react/outline';
import { User } from 'lib/auth/session';

export interface NavigationProp {
  name: string;
  href: string;
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
}

export interface Breadcrumb {
  name: string;
  href: string;
  current: boolean;
}

export interface LayoutProps {
  menu: NavigationProp[];
}
