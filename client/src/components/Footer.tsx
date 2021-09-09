import * as React from 'react';
import './styles/footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__wrapper">
      <div className="footer__info">
        <div className="footer__logo">
          Reshipi
          <span className="footer__title--off"> Bukku</span>
        </div>

        <div className="footer__description">
          Reshipi Bukku is an recipe site used to find and share great recipes.
        </div>
      </div>

      <ul className="footer__list">
        <li className="footer__item footer__item--title">About</li>
        <li className="footer__item">
          <a className="footer__link" href="/about">
            About Us
          </a>
        </li>
      </ul>

      <ul className="footer__list">
        <li className="footer__item footer__item--title">Company</li>
        <li className="footer__item">
          <a className="footer__link" href="/about">
            FAQ
          </a>
        </li>
      </ul>

      <ul className="footer__list">
        <li className="footer__item footer__item--title">Support</li>
        <li className="footer__item">
          <a className="footer__link" href="/about">
            Support Center
          </a>
        </li>

        <li className="footer__item">
          <a className="footer__link" href="/about">
            Account
          </a>
        </li>

        <li className="footer__item">
          <a className="footer__link" href="/about">
            Feedback
          </a>
        </li>

        <li className="footer__item">
          <a className="footer__link" href="/about">
            Accessibility Issues
          </a>
        </li>
      </ul>
    </div>

    <div className="footer__bottom">
      <div>Copyright, Reshipi Bukku 2021 All rights reserved.</div>
    </div>
  </footer>
);
export default Footer;
