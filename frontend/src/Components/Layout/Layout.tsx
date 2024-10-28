import React from 'react';
import HeaderMenu from "../HeaderMenu/HeaderMenu";
import SideMenu from "../SideMenu/SideMenu";
import FooterMenu from '../FooterMenu/FooterMenu';
import "./Layout.scss";
import { useAuth } from '../AuthProvider/AuthProvider';

interface LayoutProps {
    children: React.ReactNode;
  }


const Layout:React.FC<LayoutProps> = ({children}) => {
    const { nickname } = useAuth();

    return (
        <div className="layout">
            <div className="header-menu"><HeaderMenu name={nickname}/></div>
            <div className="side-menu"><SideMenu/></div>
            <div className="main-content">{children}</div>
            <div className="footer-menu"><FooterMenu /></div>
        </div>
    );

}

export default Layout;