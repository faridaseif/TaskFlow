import React from 'react';
import Sidebar from './Sidebar';
import Footer from './common/Footer';

const DashboardLayout = ({ children, Topbar }) => {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                {Topbar && Topbar}
                <main className="content-area">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;
