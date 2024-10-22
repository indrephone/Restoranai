import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import UsersContext, { UserType, UsersContextTypes } from '../../contexts/UsersContext'; // Import the context and types

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const usersContext = useContext(UsersContext) as UsersContextTypes;
  const { returnSpecificUser, editSpecificUser } = usersContext;
  
  const [user, setUser] = useState<UserType | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const fetchedUser = returnSpecificUser(id);
      setUser(fetchedUser);
    }
  }, [id, returnSpecificUser]);

  return (
    user && (
      <Formik
        initialValues={{
          username: user.username || '',
          email: user.email || '',
          password: '', // Password remains empty unless changed
        }}
        onSubmit={async (values) => {
          // Create filteredValues to conditionally include the password
          const filteredValues: Omit<UserType, '_id'> = {
            username: values.username || user.username,
            email: values.email || user.email,
            role: user.role, 
            password: values.password || '', // This guarantees password is a string
            password_visible: values.password || '',
          };

          const result = await editSpecificUser(filteredValues, user._id);
          if ('success' in result) {
            navigate('/userPage');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">Username:</label>
              <Field name="username" id="username" type="text" />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <Field name="email" id="email" type="email" />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <Field name="password" id="password" type="password" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Update User
            </button>
          </Form>
        )}
      </Formik>
    )
  );
};

export default EditUser;
