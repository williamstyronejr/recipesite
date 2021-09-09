import * as React from 'react';
import './styles/footer.css';

const Footer = () => (
  <footer className="footer">
    <div>Logo</div>

    <div className="footer__wrapper">
      <ul className="footer__list">
        <li className="footer__item">
          <a className="footer__link" href="/about">
            About Us
          </a>
        </li>
      </ul>
    </div>

    <div className="">Trademark</div>
  </footer>
);
export default Footer;
