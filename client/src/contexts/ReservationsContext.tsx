import { createContext, /*useReducer,*/ useState, ReactElement } from "react";

import { Restaurant as RestaurantType } from "./RestaurantsContext";

// type Reservation = {

// }
type TableType = {
  _id: string,
  restaurantId: string,
  size: number
}
type RestaurantWithTables = RestaurantType & { tables: TableType[] };
type ChildProp = { children: ReactElement };
export type ReservationsContextTypes = {
  selectedRestaurant: RestaurantWithTables | null,
  // reservations: any,
  getSelectedRestaurant: (id?: RestaurantType["_id"]) => void
}
// type ReducerActionTypeVariations = 
// { type: "", data: "" } |
// { type: "", data: "" }

// const reducer = (state, action) => {

// }

const ReservationsContext = createContext<undefined | ReservationsContextTypes>(undefined);

const ReservationsProvider = ({ children }: ChildProp) => {

  // parinktas restoranas su visais jo staliukais
  const [selectedRestaurant, setSelectedRestaurant] = useState<null | RestaurantWithTables>(null);
  // parinkto restorano rezervacijos
  // const [reservations, dispatch] = useReducer(reducer, []);

  const getSelectedRestaurant = (id?: RestaurantType["_id"]) => {
    if(id){
      fetch(`/api/restaurants/${id}`)
        .then(res => res.json())
        .then((data:RestaurantWithTables[]) => {
          // console.log(data);
          setSelectedRestaurant(data[0]);
        })
    } else {
      setSelectedRestaurant(null);
    }
  }

  return (
    <ReservationsContext.Provider
      value={{
        selectedRestaurant,
        getSelectedRestaurant,
        // reservations
      }}
    >
      {children}
    </ReservationsContext.Provider>
  )
}

export { ReservationsProvider };
export default ReservationsContext;