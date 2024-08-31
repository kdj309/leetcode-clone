import { FC } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
interface LayOutProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
}
const Layout: FC<LayOutProps> = ({ children, className, showFooter = true }) => {
  return (
    <>
      <Navbar></Navbar>
      <main className={`${className ?? ''} tw-mx-2`}>{children}</main>
      {showFooter && <Footer />}
    </>
  );
};
export default Layout;
