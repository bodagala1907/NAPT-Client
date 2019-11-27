import React from 'react';
import './Footer.scss';
import tb from '../assets/tb-logo.svg';

function Footer() {
    return (
        <div className="footer">
            <span className="footer-text"> © Nisum Technologies Inc.</span>
            <img src={tb} alt="Tailored Brand logo" className="footer-logo"/>
        </div>
    )
}

export default Footer
