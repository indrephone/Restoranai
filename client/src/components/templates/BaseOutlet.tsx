import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Header from '../UI/organisms/Header';
import Footer from '../UI/organisms/Footer';

const StyledMain = styled.main`
  flex-grow: 1;  /* Ensures main content takes the remaining space */
  margin: 0;     /* Ensure no margin is applied */
  padding: 0;    /* Ensure no padding is applied */
  box-sizing: border-box;  /* Ensure padding is included in total height calculation */
  display: flex;
  flex-direction: column;
`;


const BaseOutlet = () => {
    return ( 
        <>
         <Header />
           <StyledMain>
              <Outlet />
           </StyledMain>
          <Footer />
        </>
     );
}
 
export default BaseOutlet;