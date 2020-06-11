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
import React, { useState } from "react";
import { db, increment } from "../firebase";
import { Item, Options } from "../types";

type ItemCardContentProps = {
  item: Item;
  id: string;
  type: Options;
};

export const ItemCard = (props: ItemCardContentProps) => {
  const { item, id, type } = props;
  const [showVoteSuccessAlert, setShowVoteSuccessAlert] = useState(false);
  const [showVoteErrorAlert, setShowVoteErrorAlert] = useState(false);

  const voteForItem = async () => {
    try {
      await incrementValue("items", id, type);
      setShowVoteSuccessAlert(true);
    } catch (error) {
      setShowVoteErrorAlert(true);
    }
  };

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

      <Card>
        <CardHeader
          title={type === "this" ? "This" : "That"}
          titleTypographyProps={{
            color: type === "this" ? "primary" : "secondary",
          }}
        />
        <CardContent>
          <Typography variant="body1" align="left">
            {item.value}
          </Typography>
          {item.votes}
        </CardContent>
        <CardActions>
          <Button
            startIcon={<ThumbUpIcon />}
            size="medium"
            color={type === "this" ? "primary" : "secondary"}
            onClick={voteForItem}
          >
            {type === "this" ? "This " : "That "} is what I would choose
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

const incrementValue = (
  collectionPath: string,
  documentPath: string,
  thisOrThat: Options
) => {
  const ref = db.collection(collectionPath).doc(documentPath);
  return thisOrThat === "this"
    ? ref.update({ "this.votes": increment(1) })
    : ref.update({ "that.votes": increment(1) });
};

export default ItemCard;
