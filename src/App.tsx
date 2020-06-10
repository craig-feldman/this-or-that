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
  Fab,
  TextField,
  Box,
  createMuiTheme,
  ThemeProvider,
  Divider,
} from "@material-ui/core";
import { db } from "./firebase";
import {
  getDocumentsFromFirestoreViaPath,
  FirebaseDocument,
  incrementValue,
} from "./firebase-utils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Alert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/AddCircleOutline";

type ThisAndThatPair = {
  this: Item;
  that: Item;
  title: string;
} & FirebaseDocument;

const useStylesApp = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

function App() {
  const classes = useStylesApp();

  const [showAdd, setShowAdd] = useState(false);

  const [items, loading, error] = useCollectionData<ThisAndThatPair>(
    db.collection("items"),
    {
      idField: "id",
    }
  );

  const themeLight = createMuiTheme({
    palette: {
      background: {
        // paper: "#1e88e5",
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={themeLight}>
        <CssBaseline />

        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h1">This or That </Typography>
            <Fab
              variant="extended"
              color="primary"
              onClick={() => setShowAdd(true)}
            >
              <AddIcon className={classes.extendedIcon} />
              Add This Or That
            </Fab>
            {showAdd && <AddThisOrThat setShowAdd={setShowAdd} />}
            {error && <div>Something went wrong ...</div>}
            {loading && <div>Loading ...</div>}
            {items && <ThisOrThatList items={items} />}
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

const useStylesAdd = makeStyles((theme) => ({
  buttons: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

type AddThisOrThatProps = {
  setShowAdd: React.Dispatch<React.SetStateAction<boolean>>;
};
const AddThisOrThat = (props: AddThisOrThatProps) => {
  const classes = useStylesAdd();

  return (
    <Box marginY={2}>
      <Card>
        <CardHeader
          title="Add"
          subheader="Add a 'this or that item' to let the community vote on it!"
        />
        <CardContent>
          <form noValidate autoComplete="off">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  id="add-title"
                  name="title"
                  label="Post title"
                  variant="outlined"
                  fullWidth
                  inputProps={{ style: { textAlign: "center" } }}
                  // InputLabelProps={{
                  //   style: { textAlign: "center" },
                  // }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  id="add-this"
                  name="this"
                  label="this"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="h5"> VS </Typography>
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  id="add-that"
                  name="that"
                  label="that"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <Divider />
        <CardActions>
          <Box justifyContent="center" width="100%" className={classes.buttons}>
            <Button variant="contained" color="primary">
              Submit
            </Button>
            <Button variant="contained" onClick={() => props.setShowAdd(false)}>
              Cancel
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};

type ThisOrThatListProps = {
  items: ThisAndThatPair[];
};
const ThisOrThatList = (props: ThisOrThatListProps) => {
  console.log("Rendering this or that list");
  const resultList = props.items.map((item) => (
    <Box key={item.id} marginY={4}>
      <Typography variant="h4">{item.title}</Typography>
      <ThisOrThat thisAndThatPair={item} />
    </Box>
  ));

  return <Box marginY={4}>{resultList}</Box>;
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
