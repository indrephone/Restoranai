import { useReducer, useState, useEffect, createContext, ReactElement } from "react";

type ChildProp = { children: ReactElement };
export type UserType = {
  _id: string,
  email: string,
  username: string,
  password: string,
  password_visible: string,
  role: "user" | "admin"
};

export type ErrorOrSuccessReturn = { error?: string; success?: string };

export type UsersContextTypes = {
  users: UserType[],
  addNewUser: (user: Omit<UserType, "_id">) => Promise<ErrorOrSuccessReturn>,
  loggedInUser: UserType | null,
  logUserIn: (userLoginInfo: Pick<UserType, "email" | "password">) => Promise<ErrorOrSuccessReturn>,
  deleteUser: (userId: string) => Promise<ErrorOrSuccessReturn>,
  logout: () => void,
  editSpecificUser: (editedUser: Omit<UserType, "_id">, userId: string) => Promise<ErrorOrSuccessReturn>,
  returnSpecificUser: (id: string) => UserType | undefined;
};

type ReducerActionTypeVariations =
  | { type: 'uploadData'; allData: UserType[] }
  | { type: 'add'; data: UserType }
  | { type: 'delete'; id: string }
  | { type: 'editUser'; data: Omit<UserType, '_id'>; id: string };


const reducer = (state: UserType[], action: ReducerActionTypeVariations): UserType[] => {
  switch(action.type) {
    case "uploadData":
      return action.allData;
    case "add":
      return [...state, action.data];
    case "delete":
      return state.filter(user => user._id !== action.id);
    case "editUser":
      return state.map(el => 
        el._id === action.id ? { ...el, ...action.data } : el
    );
    default:
      return state;
  }
};

const UsersContext = createContext<UsersContextTypes | undefined>(undefined);

const UsersProvider = ({ children }: ChildProp) => {
  const [users, dispatch] = useReducer(reducer, []);
  const [loggedInUser, setLoggedInUser] = useState<null | UserType>(null);

  // Function to add a new user
  const addNewUser = async (user: Omit<UserType, "_id">): Promise<ErrorOrSuccessReturn> => {
    try {
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (res.status === 409) return await res.json();
      
      const data = await res.json();
      dispatch({ type: 'add', data });
      setLoggedInUser(data);
      localStorage.setItem('loggedInUser', JSON.stringify(data)); // issaugojam i local storage
      return { success: 'Registration successful' };
    } catch (err) {
      console.error(err);
      return { error: 'Server error. Please try again later.' };
    }
  };

  // Function to log a user in
  const logUserIn = async (userLoginInfo: Pick<UserType, 'email' | 'password'>): Promise<ErrorOrSuccessReturn> => {
    try {
      // console.log(userLoginInfo);
      const res = await fetch(`/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(userLoginInfo)
      });
      // console.log(res);
      if(res.status === 401){ // neteisingos prisijungimo įvestys
        const error = await res.json();
        // console.log(error);
        return error;
      } else { // teisingos prisijungimo įvestys
        const data = await res.json();
        // console.log(data);
        setLoggedInUser(data);
        localStorage.setItem('loggedInUser', JSON.stringify(data));
        return { success: 'Prisijungimas sėkmingas. Tuoj būsite nukelti į Home puslapį.' }
      }
    } catch(err) {
      console.error(err);
      return { error: 'Bandant prisijungti, įvyko serverio klaida. Prašome bandyti vėliau.' };
    }
  }  

  // Function to log the user out
  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
  };

  // Function to delete a user
  const deleteUser = async (userId: string): Promise<ErrorOrSuccessReturn> => {
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (res.status === 404) {
        return { error: 'User not found.' };
      }
      if (!res.ok) {
        return { error: 'Failed to delete user.' };
      }
      return { success: 'User deleted successfully.' };
    } catch (err) {
      console.error(err);
      return { error: 'Error deleting user. Please try again later.' };
    }
  };  




  const editSpecificUser = async (editedUser: Omit<UserType, "_id">, userId: string): Promise<ErrorOrSuccessReturn> => {
    try {
      // Fetch current user info from localStorage
      const localStorageInfo = localStorage.getItem('loggedInUser');
      let currentUser: UserType | null = null;
  
      if (localStorageInfo) {
        currentUser = JSON.parse(localStorageInfo) as UserType;
      }
  
      // Check if the currentUser exists and matches the userId
      if (!currentUser || currentUser._id !== userId) {
        return { error: "User not found in localStorage or mismatch with userId." };
      }
  
      // Merge the updated data from editedUser and currentUser
      const updatedUser = {
        ...currentUser,  // Keep old data
        username: editedUser.username || currentUser.username,
        email: editedUser.email || currentUser.email,
        password: editedUser.password || currentUser.password,  // Retain old password if not updated
        password_visible: editedUser.password ? editedUser.password : currentUser.password_visible, // Update password_visible only if password is changed
        role: currentUser.role,  // Role should remain the same
      };
  
      // Send the PATCH request to update user data in the backend
      const res = await fetch(`/api/edit-user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),  // Send the updated user data
      });
  
      if (!res.ok) return { error: "Failed to update user." };
  
      // Update both the state and localStorage with the merged user data
      setLoggedInUser(updatedUser);
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
  
      return { success: "User updated successfully." };
    } catch (err) {
      console.error("Error updating user:", err);
      return { error: "Server error. Please try again later." };
    }
  };
  
  
    


  // Function to return a specific user
  const returnSpecificUser = (id: string): UserType | undefined => users.find(user => user._id === id);

  useEffect(() => {
    fetch(`/api/users`)
      .then(res => res.json())
      .then(data => dispatch({ type: "uploadData", allData: data }))
      .catch(err => console.error(err));

    const localStorageInfo = localStorage.getItem('loggedInUser');
    if (localStorageInfo) {
      const userInfo = JSON.parse(localStorageInfo) as UserType;
      setLoggedInUser(userInfo);
    }
  }, []);

  return (
    <UsersContext.Provider value={{
      users,
      addNewUser,
      loggedInUser,
      logUserIn,
      deleteUser,
      logout,  // Make sure the logout function is provided here
      editSpecificUser,
      returnSpecificUser
    }}>
      {children}
    </UsersContext.Provider>
  );
}

export { UsersProvider };
export default UsersContext;
