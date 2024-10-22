import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaSquareInstagram, FaFacebook, FaSquareXTwitter } from "react-icons/fa6";

const StyledFooter = styled.footer`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 20px;
  background-color: #f4f4f4;
  align-items: center;
  gap: 20px;
  text-align: center;
  background-color: yellow;

   /* Responsive design for mobile screens */
   @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack into one column */
    text-align: center; /* Ensure everything is centered */
  }

  > div:first-child {
    /* Styling for the first column (logo) */
    img {
      width: 150px;
    }
  }

  > div:nth-child(2) {
    /* Styling for the second column (social icons and copyright) */
    ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    li {
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 18px;
    }

    svg {
      font-size: 24px;
      cursor: pointer;
    }

    a {
      color: inherit;
      text-decoration: none;
      &:hover {
        color: #555;
      }
    }

    li:last-child {
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }
  }

  > div:nth-child(3) {
    /* Styling for the third column (links) */
    ul {
      list-style: none;
      padding: 0;
    }

    li {
      margin: 10px 0;
      font-size: 16px;
    }

    a {
      text-decoration: none;
      color: inherit;
      &:hover {
        color: #555;
      }
    }
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      {/* Logo Section */}
      <div>
        <img src="/village_kitchen_logo.png" alt="logo" />
      </div>

      {/* Social Icons and Copyright Section */}
      <div>
        <ul>
          <li>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaSquareInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaSquareXTwitter />
            </a>
          </li>
          <li>&copy; 2024 Village Kitchen</li>
        </ul>
      </div>

      {/* Links Section */}
      <div>
        <ul>
          <li>
            <Link to="/terms">Bendrosios Naudojimosi Sąlygos</Link>
          </li>
          <li>
            <Link to="/privacy">Asmeniniai Duomenys</Link>
          </li>
          <li>
            <Link to="/cookies">Slapukai</Link>
          </li>
          <li>
            <Link to="/stores">Restoranų Žemėlapis</Link>
          </li>
        </ul>
      </div>
    </StyledFooter>
  );
};

export default Footer;
