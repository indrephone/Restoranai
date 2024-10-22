import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Restaurant as RestaurantType } from "../../../contexts/RestaurantsContext";

type Props = {
    data: RestaurantType;
}

const StyledDiv = styled.div`
  border: 1px solid black;
  width: 500px;
  height: 400px;
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: #f9f9f9; /* Optional: Adds a background color */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Optional: Adds a subtle shadow */ 
`;

const RestaurantCard = ({ data }: Props) => {
    return ( 
        <StyledDiv>
           <h3>{data.location}</h3>
           <div>
              <h4>Darbo laikas:</h4>
              <p>Pirmadienis: {data.workHours.monday}</p>
              <p>Antradienis: {data.workHours.monday}</p> 
              <p>Treciadienis: {data.workHours.monday}</p> 
              <p>Ketvirtadienis: {data.workHours.monday}</p> 
              <p>Penktadienis: {data.workHours.monday}</p> 
              <p>Sestadienis: {data.workHours.monday}</p>
              <p>Sekmadienis: {data.workHours.monday}</p>   
           </div>
           <p>Platesne info ir rezervacija: 
             <Link to={data._id}> nuoroda</Link></p>
        </StyledDiv>
     );
}
 
export default RestaurantCard;