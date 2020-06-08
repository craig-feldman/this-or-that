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
} from "@material-ui/core";
import { db } from "./firebase";
import {
  getDocumentsFromFirestoreViaPath,
  FirebaseDocument,
} from "./firebase-utils";

// const itemsTest: [Item, Item][] = [
//   [
//     { value: "Test this", votes: 0 },
//     { value: "Test that", votes: 0 },
//   ],

//   [
//     { value: "Second test this", votes: 5 },
//     { value: "Second Test that", votes: 1 },
//   ],
// ];

type ThisAndThatPair = { this: Item; that: Item } & FirebaseDocument;

const fetchItems = async () => {
  const snapshot = await db.collection("items").get();
  snapshot.forEach((doc) => console.log(doc.id, " => ", doc.data()));
};

function App() {
  const [items, setItems] = useState<ThisAndThatPair[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await getDocumentsFromFirestoreViaPath<ThisAndThatPair>(
          "items"
        );
        console.log({ result });

        setItems(result);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);
  return (
    <>
      <CssBaseline />

      <Container maxWidth="md">
        <Typography variant="h1">This or That </Typography>
        {isError && <div>Something went wrong ...</div>}

        {isLoading ? <div>Loading ...</div> : <ThisOrThatList items={items} />}
      </Container>
    </>
  );
}

type ThisOrThatListProps = {
  items: ThisAndThatPair[];
};
const ThisOrThatList = (props: ThisOrThatListProps) => {
  const resultList = props.items.map((item, key) => (
    <div key={key}>
      <ThisOrThat key={key} thisItem={item.this} thatItem={item.that} />
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
  thisItem: Item;
  thatItem: Item;
};
const ThisOrThat = (props: ThisOrThatProps) => {
  const classes = useStyles();
  const { thisItem, thatItem } = props;

  return (
    <>
      <Grid container>
        <Grid item xs component={Card} className={classes.card}>
          <CardHeader title={"This"} />
          <ItemCardContent item={thisItem} />
        </Grid>
        <Grid item xs component={Card} className={classes.card}>
          <CardHeader title={"That"}></CardHeader>
          <ItemCardContent item={thatItem} />
        </Grid>
      </Grid>
    </>
  );
};
type ItemCardContentProps = { item: Item };
const ItemCardContent = (props: ItemCardContentProps) => {
  const [voteCount, setVoteCount] = useState(props.item.votes);

  return (
    <>
      <CardContent>
        {props.item.value}
        {voteCount}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => setVoteCount(voteCount + 1)}
        >
          +1
        </Button>
      </CardActions>
    </>
  );
};

export default App;
