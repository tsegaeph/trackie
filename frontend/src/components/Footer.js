import React from "react";
import "./Footer.css";
import { FaLinkedin, FaEnvelope, FaTelegramPlane } from "react-icons/fa";

const Footer = () => (
  <footer className="footer">
    <div className="footer-left">
    Just a bunch of circuits and curiosity.
      <div className="footer-date">© {new Date().getFullYear()} Tsega Ephrem — All rights reserved.</div>
    </div>
    <div className="footer-right">
      <a
        href="mailto:tsegaephre080@gmail.com"
        aria-label="Email"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaEnvelope />
      </a>
      <a
        href="https://www.linkedin.com/in/tsega-ephrem-668a64295/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <FaLinkedin />
      </a>
      <a
        href="https://t.me/IDONHAVEAUSERNAME"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
      >
        <FaTelegramPlane />
      </a>
    </div>
  </footer>
);

export default Footer;
