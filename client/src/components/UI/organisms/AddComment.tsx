import { Link, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import * as Yup from 'yup';
import { useFormik } from "formik";

import UsersContext from "../../../contexts/UsersContext";
import CommentsContext from "../../../contexts/CommentsContext";
import { CommentsContextTypes, CommentType } from "../../../contexts/CommentsContext";
import { UsersContextTypes } from "../../../contexts/UsersContext";

type FormikValuesType = {
  comment: CommentType["comment"],
  rating: CommentType["rating"] | string
}

const AddComment = () => {

  const { id:restaurantId } = useParams();
  const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;
  const { addNewComment } = useContext(CommentsContext) as CommentsContextTypes;
  const [commentAddResponseMessage, setCommentAddResponseMessage] = useState('');

  const formik = useFormik<FormikValuesType>({
    initialValues:{
      rating: '',
      comment: ''
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .required('Privalu pasirinkti įvertinimą.'),
      comment: Yup.string()
        .min(1, 'Komentaras privalo būti bent 10 simbolių ilgio.')
        .max(200, 'Komentaras privalo būti ne ilgesnis negu 200 simbolių.')
        .required('Privalu parašyti įvertinimo komentarą.')
    }),
    onSubmit: async (values) => {
      try {
        console.log(values);
        const completeComment: Omit<CommentType, "_id"> = {
          userId: loggedInUser?._id as string,
          restaurantId: restaurantId as string,
          rating: Number(values.rating) as CommentType['rating'],
          comment: values.comment,
          dateTime: new Date().toISOString()
        };
        if(loggedInUser){
          const addResponse = await addNewComment(completeComment, loggedInUser);
          if("error" in addResponse){ // nepridejo komentaro
            setCommentAddResponseMessage(addResponse.error); // vartotojui atvaizudoti error
            // setTimeout(() => {
            //   setCommentAddResponseMessage(''); // pradanginti zinute po 10s
            // }, 10000);
          } else { // pridejo komentara
            setCommentAddResponseMessage(addResponse.success); // vartotojui atvaizudoti sekmes
            setTimeout(() => {
              setCommentAddResponseMessage(''); // pradanginti zinute po 3s
            }, 3000);
            formik.resetForm();
          }
        }
      } catch(err) {
        console.error(err);
      }
    }
  });

  return (
    <div>
      <h3>Palikite atsiliepimą</h3>
      {
        !loggedInUser ?
        <p>Turite <Link to="/prisijungti">prisijungti</Link> norėdami palikti atsiliepimą.</p> :
        <>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="rating">Įvertinimas:</label>
              <select name="rating" id="rating" 
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                value={formik.values.rating} 
              >
                <option value='' disabled>Pasirinkite įvertinimą</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
              {
                formik.touched.rating && formik.errors.rating 
                && <p>{formik.errors.rating}</p>
              }
            </div>
            <div>
              <label htmlFor="comment">Atsiliepimas:</label>
              <textarea
                name="comment" id="comment"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.comment}
              />
              {
                formik.touched.comment && formik.errors.comment 
                && <p>{formik.errors.comment}</p>
              }
            </div>
            <input type="submit" value="Pateikti" />
          </form>
          { commentAddResponseMessage && <p>{commentAddResponseMessage}</p> }
        </>
      }
    </div>
  );
}
 
export default AddComment;