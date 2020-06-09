import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  makeStyles,
  Snackbar,
} from "@material-ui/core";
import { db } from "./firebase";
import {
  getDocumentsFromFirestoreViaPath,
  FirebaseDocument,
  incrementValue,
} from "./firebase-utils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Alert from "@material-ui/lab/Alert";

type ThisAndThatPair = {
  this: Item;
  that: Item;
  title: string;
} & FirebaseDocument;

function App() {
  const [items, loading, error] = useCollectionData<ThisAndThatPair>(
    db.collection("items"),
    {
      idField: "id",
    }
  );

  return (
    <>
      <CssBaseline />

      <Container maxWidth="md">
        <Typography variant="h1">This or That </Typography>
        {error && <div>Something went wrong ...</div>}
        {loading && <div>Loading ...</div>}
        {items && <ThisOrThatList items={items} />}
      </Container>
    </>
  );
}

type ThisOrThatListProps = {
  items: ThisAndThatPair[];
};
const ThisOrThatList = (props: ThisOrThatListProps) => {
  console.log("Rendering this or that list");
  const resultList = props.items.map((item) => (
    <div key={item.id}>
      <Typography variant="h4">{item.title}</Typography>
      <ThisOrThat thisAndThatPair={item} />
    </div>
  ));

  return <>{resultList}</>;
};

const useStyles = makeStyles({
  card: {
    margin: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

type Item = {
  value: string | JSX.Element;
  votes: number;
} & FirebaseDocument;

type ThisOrThatProps = {
  thisAndThatPair: ThisAndThatPair;
};
const ThisOrThat = (props: ThisOrThatProps) => {
  const classes = useStyles();
  const { thisAndThatPair } = props;

  console.log("rendering this or that");

  return (
    <>
      <Grid container>
        <Grid item xs component={Card} className={classes.card}>
          <ItemCardContent
            item={thisAndThatPair.this}
            id={thisAndThatPair.id}
            type="this"
          />
        </Grid>
        <Grid item xs component={Card} className={classes.card}>
          <ItemCardContent
            item={thisAndThatPair.that}
            id={thisAndThatPair.id}
            type="that"
          />
        </Grid>
      </Grid>
    </>
  );
};

type ItemCardContentProps = { item: Item; id: string; type: "this" | "that" };
const ItemCardContent = (props: ItemCardContentProps) => {
  const [showVoteSuccessAlert, setShowVoteSuccessAlert] = useState(false);
  const [showVoteErrorAlert, setShowVoteErrorAlert] = useState(false);

  const voteForItem = async () => {
    try {
      await incrementValue("items", props.id, props.type);
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
          You voted for {props.type === "this" ? `'THIS'` : `'THAT'`}
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

      <CardHeader title={props.type === "this" ? "This" : "That"} />
      <CardContent>
        {props.item.value}
        {props.item.votes}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={voteForItem}>
          Vote
        </Button>
      </CardActions>
    </>
  );
};

export default App;
