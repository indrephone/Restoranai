import styled from "styled-components";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import UsersContext, { UsersContextTypes } from "../../../contexts/UsersContext";


const StyledHeader = styled.header`
  padding: 0 20px;
  height: 100px;
  border-bottom: 3px solid black;

  display: flex;
  justify-content: space-between;
  align-items: center;

  > div.logo{
    height: 80%;
    > a{
      > img{
        height: 100%;
      }
    }
  }
  > nav{
    > ul{
      margin: 0;
      padding: 0;

      display: flex;
      gap: 10px;

      > li{
        list-style-type: none;

        > a{
          text-decoration: none;
          font-size: 1.3rem;

          &:hover{
            color: green;
          }
          &.active{
            color: red;
          }
        }
      }
    }
  }
`;

const Header = () => {

  const { loggedInUser, logout } = useContext(UsersContext) as UsersContextTypes;
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <div className="logo">
        <Link to='/'>
          <img src="/village_kitchen_logo.png" alt="logo" />
        </Link>
      </div>
      <nav>
        <ul>
          <li><NavLink to="/">Pradžia</NavLink></li>
          <li><NavLink to="/restoranai">Restoranai</NavLink></li>
          <li>
            {
              loggedInUser ?
              <NavLink to="/rezervuoti">Rezervuoti</NavLink>:
              <span title='Norėdami rezervuoti - prisijunkite'>Rezervuoti</span>
            }
          </li>
        </ul>
      </nav>
      <div className="user">
        {
          loggedInUser ?
          <>
            <Link to={`/userPage`}>{loggedInUser.username}</Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
            >Logout</button>
          </> :
          <>
            <Link to="/prisijungti">Prisijungti</Link>
            <Link to="/registruotis">Registruotis</Link>
          </>
        }
      </div>
    </StyledHeader>
  );
}
 
export default Header;