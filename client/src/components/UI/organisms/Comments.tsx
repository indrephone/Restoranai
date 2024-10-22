import { useEffect, useContext } from "react";
import styled from "styled-components";

import CommentsContext from "../../../contexts/CommentsContext";
import { CommentsContextTypes } from "../../../contexts/CommentsContext";
import CommentCard from "../molecules/CommentCard";

const StyledSection = styled.section`
  
  > div{
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

type Props = {
  restaurantId: string
}

const Comments = ({ restaurantId }: Props) => {

  const { comments, setRestaurantComments } = useContext(CommentsContext) as CommentsContextTypes;
  
  useEffect(() => {
    setRestaurantComments(restaurantId);
    // gauti visus komentarus šio restorano
  }, []);
  
  return (
    <StyledSection>
      <h3>Komentarai:</h3>
      <div>
        {
          comments.length ?
          comments.map(comment => 
            <CommentCard 
              key={comment._id}
              data={comment}
            />
          ) : 
          <p>Šis restoranas komentarų dar neturi. Būk pirmasis palikęs komentarą.</p>
        }
      </div>
    </StyledSection>
  );
}
 
export default Comments;