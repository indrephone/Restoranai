import { Routes, Route } from "react-router-dom";

import BaseOutlet from "./components/templates/BaseOutlet";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Home from "./components/pages/Home";
import Restaurants from "./components/pages/Restaurants";
import Restaurant from "./components/pages/Restaurant";
import UserPage from "./components/pages/UserPage";
import EditUser from "./components/pages/EditUser";
import Reservation from "./components/pages/Reservation";

const App = () => {

  return (
    <Routes>
      <Route path='prisijungti' element={<Login />}/>
      <Route path='registruotis' element={<Register />}/>
      <Route path='' element={<BaseOutlet />}>
        <Route index element={<Home />}/>
        <Route path="restoranai" element={<Restaurants />}/>
        <Route path="restoranai/:id" element={<Restaurant />}/>
        <Route path="userPage" element={<UserPage />}/>
        <Route path="edit-user/:id" element={<EditUser />} />
        <Route path="rezervuoti" element={<Reservation /> }/>
      </Route>
    </Routes>
  )
}

export default App;