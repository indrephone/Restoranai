import { createContext, useReducer, ReactElement } from "react";
import { UserType, ErrorOrSuccessReturn } from "../contexts/UsersContext";

type ChildProp = { children: ReactElement };
export type CommentType = { // type to send to db
  _id: string,
  userId: string,
  restaurantId: string,
  comment: string,
  rating: 1 | 2 | 3 | 4 | 5,
  dateTime: string,
  likes?: string[]
};
type CommentWithUser = CommentType & { // type to use in context
  userData: UserType[]
}
export type CommentsContextTypes = {
  comments: CommentWithUser[],
  setRestaurantComments: (id: CommentType["restaurantId"]) => Promise<void>,
  addNewComment: (newComment: Omit<CommentType, "_id">, loggedInUser: UserType) => Promise<ErrorOrSuccessReturn>
}
type ReducerActionTypeVariations = 
{ type: 'setComments', data: CommentWithUser[] } |
{ type: 'addComment', newComment: CommentWithUser } |
{ type: 'reset' }

const reducer = (state: CommentWithUser[], action: ReducerActionTypeVariations): CommentWithUser[] => {
  switch(action.type){
    case 'setComments':
      return action.data;
    case 'addComment':
      return [...state, action.newComment];
    case 'reset':
      return [];
  }
}

const CommentsContext = createContext<undefined | CommentsContextTypes>(undefined);

const CommentsProvider = ({ children }: ChildProp) => {

  const [comments, dispatch] = useReducer(reducer, []);

  const setRestaurantComments = async (id: CommentType['restaurantId']) => {
    try {
      dispatch({
        type: "reset"
      });
      const res = await fetch(`/api/comments/${id}`);
      const data = await res.json();
      dispatch({
        type: "setComments",
        data: data
      });
    } catch(err) {
      console.error(err);
    }
  }

  const addNewComment = async (newComment: Omit<CommentType, "_id">, loggedInUser: UserType): Promise<ErrorOrSuccessReturn> => {
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(newComment)
      });
      const data: CommentType = await res.json();
      const commentWithUser: CommentWithUser = {
        ...data,
        userData: [loggedInUser]
      }
      console.log(data);
      dispatch({
        type: "addComment",
        newComment: commentWithUser
      });
      return { success: "Sėkmingai pridėtas naujas atsiliepimas." };
    } catch(err) {
      console.error(err);
      return { error: "Kažkas blogo įvyko su serveriu..." };
    }
  }

  return (
    <CommentsContext.Provider
      value={{
        comments,
        setRestaurantComments,
        addNewComment
      }}
    >
      {children}
    </CommentsContext.Provider>
  )
}

export { CommentsProvider };
export default CommentsContext;