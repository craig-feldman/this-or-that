import React, { useState } from "react";
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
import { db, serverTimestamp } from "./firebase";
import { FirebaseDocument, incrementValue } from "./firebase-utils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Alert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { useForm } from "react-hook-form";

type ThisAndThatPair = {
  this: Item;
  that: Item;
  title: string;
  createdAt: firebase.firestore.FieldValue;
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
    db.collection("items").orderBy("createdAt", "desc"),
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

type FormData = {
  this: string;
  that: string;
  title: string;
};

type AddThisOrThatProps = {
  setShowAdd: React.Dispatch<React.SetStateAction<boolean>>;
};
const AddThisOrThat = (props: AddThisOrThatProps) => {
  const classes = useStylesAdd();
  const { register, handleSubmit, errors } = useForm<FormData>();
  const [showSubmitSuccessAlert, setShowSubmitSuccessAlert] = useState(false);
  const [showSubmitErrorAlert, setShowSubmitErrorAlert] = useState(false);

  const onSubmit = async (data: FormData) => {
    console.log({ data });
    try {
      const newThisAndThatPair: Omit<
        ThisAndThatPair,
        keyof FirebaseDocument
      > = {
        this: { votes: 0, value: data.this },
        that: { votes: 0, value: data.that },
        title: data.title,
        createdAt: serverTimestamp(),
      };
      await db.collection("items").add(newThisAndThatPair);
      setShowSubmitSuccessAlert(true);
    } catch (error) {
      console.error("An error occurred while submitting the data.", error);
      setShowSubmitErrorAlert(true);
    }
  };

  return (
    <>
      <Snackbar
        open={showSubmitSuccessAlert}
        autoHideDuration={6000}
        onClose={() => setShowSubmitSuccessAlert(false)}
      >
        <Alert
          onClose={() => setShowSubmitSuccessAlert(false)}
          severity="success"
        >
          Successfully submitted.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSubmitErrorAlert}
        autoHideDuration={6000}
        onClose={() => setShowSubmitErrorAlert(false)}
      >
        <Alert onClose={() => setShowSubmitErrorAlert(false)} severity="error">
          Whoops. Looks like there was an error while submitting.
        </Alert>
      </Snackbar>
      <Box marginY={2}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader
              title="Add"
              subheader="Add a 'this or that item' to let the community vote on it!"
            />
            <CardContent>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    inputRef={register({ required: true })}
                    id="add-title"
                    name="title"
                    label="Post title"
                    variant="outlined"
                    fullWidth
                    inputProps={{ style: { textAlign: "center" } }}
                    error={!!errors.title}
                    helperText={
                      errors.title && "Please enter a title for the post."
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    inputRef={register({ required: true })}
                    id="add-this"
                    name="this"
                    label="this"
                    variant="outlined"
                    fullWidth
                    error={!!errors.this}
                    helperText={
                      errors.this && "Please enter your first option."
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography variant="h5"> VS </Typography>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    inputRef={register({ required: true })}
                    id="add-that"
                    name="that"
                    label="that"
                    variant="outlined"
                    fullWidth
                    error={!!errors.that}
                    helperText={
                      errors.that && "Please enter your second option."
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions>
              <Box
                justifyContent="center"
                width="100%"
                className={classes.buttons}
              >
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <Button
                  // type="reset"
                  variant="contained"
                  onClick={() => props.setShowAdd(false)}
                >
                  Cancel
                </Button>
              </Box>
            </CardActions>
          </form>
        </Card>
      </Box>
    </>
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
};

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
