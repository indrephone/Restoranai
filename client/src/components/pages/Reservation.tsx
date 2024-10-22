import styled from "styled-components";
import { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';

import RestaurantsContext from "../../contexts/RestaurantsContext";
import { RestaurantsContextTypes } from "../../contexts/RestaurantsContext";
import ReservationsContext from "../../contexts/ReservationsContext";
import { ReservationsContextTypes } from "../../contexts/ReservationsContext";

const StyledSection = styled.section`

`;

const Reservation = () => {

  const { restaurants } = useContext(RestaurantsContext) as RestaurantsContextTypes;
  const { selectedRestaurant, getSelectedRestaurant } = useContext(ReservationsContext) as ReservationsContextTypes;

  const formik = useFormik({
    initialValues: {
      restaurantId: '',
      date: '',
      people: ''
    },
    validationSchema: Yup.object({

    }),
    onSubmit: (values) => {
      console.log(values);
    }
  });

  useEffect(() => {
    // console.log(selectedRestaurant);
    if(selectedRestaurant){
      formik.setFieldValue('restaurantId', selectedRestaurant._id);
    }
  }, [selectedRestaurant]);

  // useEffect vykdys return funkciją kai koponentas yra uždaromas tik tuo atveju jeigu dependency masyvas yra tuščias
  useEffect(() => {
    return () => {
      getSelectedRestaurant();
    }
  }, []);

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Increment by 1 day

    // Format tomorrow's date as YYYY-MM-DD
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <StyledSection>
      <h2>Rezervacija</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <select name="restaurantId" id="restaurantId"
            value={formik.values.restaurantId}
            onChange={(e) => {
              formik.handleChange(e);
              getSelectedRestaurant(e.target.value);
            }}
          >
            <option value="" disabled>Pasirinkite restoraną</option>
            {
              restaurants.length ?
              restaurants.map(restaurant => 
                <option
                  key={restaurant._id}
                  value={restaurant._id}
                >{restaurant.location}</option>
              ) : ''
            }
          </select>
        </div>
        <div>
          <label htmlFor="date">Pasirinkti datą:</label>
          <input
            disabled={selectedRestaurant ? false : true}
            type="date"
            name="date" id="date"
            min={getTomorrowDate()}
            value={formik.values.date}
            onChange={formik.handleChange}
          />
        </div>
        <div>
          <select name="people" id="people"
            disabled={selectedRestaurant ? false : true}
            value={formik.values.people}
            onChange={formik.handleChange}
          >
            <option value="" disabled>Pasirinkite staliuko dydį (iki)</option>
            {
              selectedRestaurant ?
              selectedRestaurant.tables.filter((table, i, arr) => 
                i === arr.findIndex(el => el.size === table.size)
              ).sort((a,b) => b.size-a.size).map(table =>
                <option key={table._id} value={table.size}>{table.size}</option>
              ) : ''
            }
          </select>
        </div>
      </form>
    </StyledSection>
  );
}
 
export default Reservation;