import styled from "styled-components";
import { UserType } from "../../../contexts/UsersContext";
import { CommentType } from "../../../contexts/CommentsContext";

const StyledDiv = styled.div`
  border: 1px solid black;
`;

type Props = {
  data: CommentType & {
    userData: UserType[]
  }
}

const CommentCard = ({ data }: Props) => {
  const user = data.userData && data.userData.length > 0 ? data.userData[0] : null;

  if (!user) {
    return <p>Unknown user</p>; // Handle the case when userData is missing or empty
  }

  return (
    <StyledDiv>
      <h4>Autorius: {user.username}</h4>
      <p>Reitingas: {data.rating}</p>
      <p>Atsiliepimas: {data.comment}</p>
    </StyledDiv>
  );
}

export default CommentCard;
