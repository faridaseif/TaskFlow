import { Globe, ExternalLink, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="brand-section">
                    <div className="footer-logo">
                        <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        <span className="logo-text">TaskFlow</span>
                    </div>
                    <span className="footer-copy">&copy; {currentYear} TaskFlow</span>
                </div>

                <div className="footer-links">
                    <ul>
                        <li><a href="#">Support</a></li>
                        <li><a href="#">Docs</a></li>
                        <li><a href="#">Terms</a></li>
                        <li><a href="#">Privacy</a></li>
                    </ul>
                </div>

                <div className="footer-meta">
                    <div className="social-links">
                        <a href="#" className="social-icon"><Globe size={16} /></a>
                        <a href="#" className="social-icon"><ExternalLink size={16} /></a>
                    </div>
                    <p className="made-with">
                        <Heart size={12} className="heart-icon" /> by TaskFlow
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
