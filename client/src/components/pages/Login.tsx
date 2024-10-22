import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { useContext, useState } from "react";

import UsersContext, { UsersContextTypes} from "../../contexts/UsersContext";

const Login = () => {

  const { logUserIn } = useContext(UsersContext) as UsersContextTypes;
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Privalo būti realus email adresas.')
        .required('Šis laukas yra privalomas.'),
      password: Yup.string()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
          'Slaptažodis privalo turėti bent: vieną mažąją raidę, vieną didžiąją raidę, vieną skaičių, vieną specialų simbolį (@$!%*?&) ir ilgis privalo būti tarp 8 ir 25 simbolių.'
        ).required('Šis laukas yra privalomas.')
    }),
    onSubmit: async (values) => {
      try {
        // console.log(values);
        const loginResponse = await logUserIn(values);
        if("error" in loginResponse){ // jeigu nesekminga rodom error
          setLoginMessage(loginResponse.error);
        } else { // jeigu sekminga prijungiam ir naviguojam i home
          setLoginMessage(loginResponse.success);
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch(err) {
        console.error(err);
      }
    }
  });

  return (
    <section>
      <h2>Prisijungti</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="email">El. Paštas:</label>
          <input
            type="email"
            name="email" id="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {
            formik.touched.email && formik.errors.email 
            && <p>{formik.errors.email}</p>
          }
        </div>
        <div>
          <label htmlFor="password">Slaptažodis:</label>
          <input
            type="password"
            name="password" id="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {
            formik.touched.password && formik.errors.password 
            && <p>{formik.errors.password}</p>
          }
        </div>
        <input type="submit" value="Prisijungti" />
      </form>
      { loginMessage && <p>{loginMessage}</p> }
      <p>Dar neturite paskyros? Eikite <Link to="/registruotis">prisiregistruoti</Link>.</p>
    </section>
  );
}
 
export default Login;