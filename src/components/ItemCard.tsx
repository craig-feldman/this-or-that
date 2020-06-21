import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Snackbar,
  Typography,
} from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Alert from "@material-ui/lab/Alert";
import React, { useContext, useState } from "react";
import { db, increment } from "../firebase";
import UserContext from "../session/UserContext";
import { Item, Options } from "../types";

type ItemCardContentProps = {
  item: Item;
  id: string;
  type: Options;
  currentVote?: Options;
};

export const ItemCard = (props: ItemCardContentProps) => {
  const { item, id, type, currentVote } = props;
  const user = useContext(UserContext);

  const [showVoteSuccessAlert, setShowVoteSuccessAlert] = useState(false);
  const [showVoteErrorAlert, setShowVoteErrorAlert] = useState(false);

  const hasVote = currentVote === type;

  const voteForItem = async () => {
    try {
      if (!user) {
        throw new Error(
          "Error: attempting to cast a vote with no user id present."
        );
      }
      await addVote(id, type, user.uid);
      await adjustVoteCount(id, type, currentVote);
      setShowVoteSuccessAlert(true);
    } catch (error) {
      console.error(error);
      setShowVoteErrorAlert(true);
    }
  };

  if (!user) {
    return <Typography color="error">Error: No user present</Typography>;
  }

  return (
    <>
      <Snackbar
        open={showVoteSuccessAlert}
        autoHideDuration={6000}
        onClose={() => setShowVoteSuccessAlert(false)}
      >
        <Alert
          onClose={() => setShowVoteSuccessAlert(false)}
          severity="success"
        >
          You voted for {type === "this" ? `'THIS'` : `'THAT'`}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showVoteErrorAlert}
        autoHideDuration={6000}
        onClose={() => setShowVoteErrorAlert(false)}
      >
        <Alert onClose={() => setShowVoteErrorAlert(false)} severity="error">
          Whoops. Looks like there was an error while voting.
        </Alert>
      </Snackbar>

      <Card style={{ height: "100%" }}>
        <CardHeader
          title={type === "this" ? "This" : "That"}
          titleTypographyProps={{
            color: type === "this" ? "primary" : "secondary",
          }}
        />
        <CardContent>
          <Typography variant="body1">{item.value}</Typography>
        </CardContent>
        <CardActions>
          <Button
            startIcon={<ThumbUpIcon />}
            size="medium"
            color={type === "this" ? "primary" : "secondary"}
            onClick={voteForItem}
            disabled={hasVote}
          >
            {type === "this" ? "This " : "That "} is what I{" "}
            {hasVote ? " have chosen" : " would choose"}
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

const addVote = (itemId: string, thisOrThat: Options, userId: string) => {
  const ref = db
    .collection("users")
    .doc(userId)
    .collection("votes")
    .doc(itemId);
  return ref.set({ vote: thisOrThat });
};

const adjustVoteCount = (
  documentPath: string,
  thisOrThat: Options,
  currentVote?: Options
) => {
  const ref = db.collection("items").doc(documentPath);
  const updateData = {
    [`${thisOrThat}.votes`]: increment(1),
    ...(currentVote && { [`${currentVote}.votes`]: increment(-1) }),
  };

  return ref.update(updateData);
};

export default ItemCard;
