import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  makeStyles,
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

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardActions: {
    marginTop: "auto",
  },
  cardHeader: {
    padding: theme.spacing(1.5),
    paddingBottom: theme.spacing(1),
  },
  cardContent: {
    padding: theme.spacing(1.5),
  },
}));

export const ItemCard = (props: ItemCardContentProps) => {
  const classes = useStyles();
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
      await addVoteForUser(id, type, user.uid);
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

      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          title={type === "this" ? "This" : "That"}
          titleTypographyProps={{
            color: type === "this" ? "primary" : "secondary",
          }}
        />
        <CardContent className={classes.cardContent}>
          <Typography variant="body1">{item.value}</Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            startIcon={<ThumbUpIcon />}
            size="medium"
            color={type === "this" ? "primary" : "secondary"}
            onClick={voteForItem}
            disabled={hasVote}
            variant="outlined"
            fullWidth={true}
          >
            {type === "this" ? "This " : "That "} is what I{" "}
            {hasVote ? " have chosen" : " would choose"}
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

/**
 * Records the voter for the user's uid.
 * Note: this does not adjust the actual vote count.
 * */
const addVoteForUser = (
  itemId: string,
  thisOrThat: Options,
  userId: string
) => {
  const ref = db
    .collection("users")
    .doc(userId)
    .collection("votes")
    .doc(itemId);
  return ref.set({ vote: thisOrThat });
};

/**
 * Adjust the vote count for the specified item.
 *
 * If the user has voted for the other option previously, that vote count is decreased.
 */
const adjustVoteCount = (
  itemId: string,
  thisOrThat: Options,
  currentVote?: Options
) => {
  if (thisOrThat === currentVote) {
    // If user manually enables a button to try double vote
    return;
  }
  const ref = db.collection("items").doc(itemId);
  const updateData = {
    [`${thisOrThat}.votes`]: increment(1),
    ...(currentVote && { [`${currentVote}.votes`]: increment(-1) }),
  };

  return ref.update(updateData);
};

export default ItemCard;
