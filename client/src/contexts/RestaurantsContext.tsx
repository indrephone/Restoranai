import { useReducer, useEffect, createContext, ReactElement, useState } from "react";

type ChildProp = { children: ReactElement };
export type Restaurant = {
  _id: string,
  location: string,
  workHours: {
    monday: string,
    tuesday: string,
    wednesday: string,
    thursday: string,
    friday: string,
    saturday: string,
    sunday: string
  },
  description: string
}
type RestaurantError = {
  errorMessage: string
}
export type RestaurantsContextTypes = {
  restaurants: Restaurant[],
  addNewRestaurant: (data: Restaurant) => void,
  findSpecificRestaurant: (id: Restaurant["_id"]) => Restaurant | undefined,
  fetchError: RestaurantError | null
}
type ReducerActionTypeVariations = 
{ type: 'uploadData', allData: Restaurant[] } |
{ type: 'add', data: Restaurant }

const reducer = (state: Restaurant[], action: ReducerActionTypeVariations): Restaurant[] => {
  switch(action.type){
    case 'uploadData':
      return action.allData;
    case 'add':
      return [...state, action.data];
  }
}

const RestaurantsContext = createContext<RestaurantsContextTypes | undefined>(undefined);

const RestaurantsProvider = ({ children }: ChildProp) => {

  const [restaurants, dispatch] = useReducer(reducer, []);
  const [fetchError, setFetchError] = useState<null | RestaurantError>(null);

  const addNewRestaurant = (data: Restaurant) => {
    fetch(``)
      .then(res => {
        console.log(res);
        if(res.status === 200){
          dispatch({
            type: 'add',
            data: data
          })
        }
      })
  };

  const findSpecificRestaurant = (id: Restaurant['_id']): Restaurant | undefined => {
    return restaurants.find(el => el._id === id);
  }

  useEffect(() => {
    fetch(`api/restaurants`)
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: 'uploadData',
          allData: data
        })
      })
      .catch(err => {
        setFetchError({ errorMessage: 'Bandant atsiūsti duomenis, įvyko serverio klaida. Prašome bandyti vėliau.' });
        console.error(err)
      })
  }, []);

  return (
    <RestaurantsContext.Provider
      value={{
        restaurants,
        addNewRestaurant,
        findSpecificRestaurant,
        fetchError
      }}
    >
      {children}
    </RestaurantsContext.Provider>
  )
};

export { RestaurantsProvider };
export default RestaurantsContext;