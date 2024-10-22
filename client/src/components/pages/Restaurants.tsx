import { useContext } from "react";
import styled from "styled-components";

import RestaurantsContext, { RestaurantsContextTypes } from "../../contexts/RestaurantsContext";
import RestaurantCard from "../UI/molecules/RestaurantCard";

const StyledSection = styled.section`
  padding: 10px 30px;

  > h2{
    text-align: center;
    font-size: 3rem;
  }
  > div{
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 1fr;
  }
`;

const Restaurants = () => {

  const { restaurants, fetchError } = useContext(RestaurantsContext) as RestaurantsContextTypes;

  return (
    <StyledSection>
      <h2>Restoranai</h2>
      <div>
        {
          restaurants.length ?
          restaurants.map(el => 
            <RestaurantCard
              key={el._id}
              data={el}
            />
          ) : fetchError?.errorMessage ?
          <p>{fetchError.errorMessage}</p> :
          <p>Loading gif...</p>
        }
      </div>
    </StyledSection>
  );
}
 
export default Restaurants;