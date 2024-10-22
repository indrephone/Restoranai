import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import RestaurantsContext, { RestaurantsContextTypes, Restaurant as RestaurantType } from "../../contexts/RestaurantsContext";
import UsersContext, { UsersContextTypes } from "../../contexts/UsersContext";
import Comments from "../UI/organisms/Comments";
import AddComment from "../UI/organisms/AddComment";

const Restaurant = () => {

  const [restaurant, setRestaurant] = useState<RestaurantType | undefined>();
  const { findSpecificRestaurant, restaurants } = useContext(RestaurantsContext) as RestaurantsContextTypes;
  const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(id){
      setRestaurant(findSpecificRestaurant(id));
    }
  }, [restaurants, id]);

  return (
    <>
    <section>
      <button onClick={() => navigate(-1)}>Grįžti atgal</button>
      {
        restaurant ? 
        <>
          <div>
            <h3>{restaurant.location}</h3>
            <p>{restaurant.description}</p>
            <div>
              <h4>Darbo laikas:</h4>
              <p>Pirmadienis: {restaurant.workHours.monday}</p>
              <p>Antradienis: {restaurant.workHours.tuesday}</p>
              <p>Trečiadienis: {restaurant.workHours.wednesday}</p>
              <p>Ketvirtadienis: {restaurant.workHours.thursday}</p>
              <p>Penktadienis: {restaurant.workHours.friday}</p>
              <p>Šeštadienis: {restaurant.workHours.saturday}</p>
              <p>Sekmadienis: {restaurant.workHours.sunday}</p>
            </div>
          </div> 
          <div>
            {
              loggedInUser ?
              <button><Link to="/rezervuoti">Rezervuotis</Link></button>:
              <button disabled={true} title='Norėdami rezervuoti - prisijunkite'>Rezervuotis</button>
            }
          </div>
        </>
        : <p>No data yet...</p>
      }
      </section>
      <section>
        {
          restaurant ? 
          <>
           <AddComment />
          <Comments restaurantId={restaurant._id} /> : null
          </>
          : null
        }
      </section>
    </>
  );
}
 
export default Restaurant;