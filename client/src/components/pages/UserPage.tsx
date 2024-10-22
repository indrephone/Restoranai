import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UsersContext from "../../contexts/UsersContext";

const UserPage = () => {
  const usersContext = useContext(UsersContext);
  const navigate = useNavigate();

  if (!usersContext) {
     return <div>Error: No user context found</div>;
  }

  const { loggedInUser, deleteUser } = usersContext;

  if (!loggedInUser) {
     return (
        <section>
           <h2>User Page</h2>
           <p>No user is logged in.</p>
        </section>
     );
  }

  const handleDelete = async () => {
     const confirmed = window.confirm('Are you sure you want to delete your profile?');
     if (confirmed) {
        const result = await deleteUser(loggedInUser._id);
        if ('success' in result) {
           alert(result.success);
           navigate('/');
        } else {
           alert(result.error);
        }
     }
  };

  return (
     <section>
        <h2>User Page</h2>
        <div>
           <p><strong>Username:</strong> {loggedInUser.username}</p>
           <p><strong>Email:</strong> {loggedInUser.email}</p>
           <p><strong>Password:</strong> {loggedInUser.password_visible}</p>
           {/* <button onClick={() => navigate(`/edit-user/${loggedInUser._id}`)}>Edit Profile</button> */}
           {loggedInUser && (
  <button onClick={() => navigate(`/edit-user/${loggedInUser._id}`)}>Edit Profile</button>
)}
console.log("Logged in user:", loggedInUser);


           <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>Delete Profile</button>
        </div>
     </section>
  );
};


export default UserPage;
