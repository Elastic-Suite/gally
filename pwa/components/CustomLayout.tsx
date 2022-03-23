import type { LayoutProps } from 'react-admin';
import { Layout } from 'react-admin';

import CustomAppBar from './CustomAppBar';
import CustomMenu from './CustomMenu';
import CustomSidebar from './CustomSidebar';

export default function CustomLayout(props: LayoutProps) {
  return (<Layout {...props} appBar={CustomAppBar} menu={CustomMenu} sidebar={CustomSidebar} />);
}
