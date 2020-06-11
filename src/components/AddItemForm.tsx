import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { db, serverTimestamp } from "../firebase";
import { FirebaseDocument, ThisAndThatPair } from "../types";

const useStyles = makeStyles((theme) => ({
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

type AddItemFormProps = {
  setShowAdd: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AddItemForm = (props: AddItemFormProps) => {
  const classes = useStyles();

  const [showSubmitSuccessAlert, setShowSubmitSuccessAlert] = useState(false);
  const [showSubmitErrorAlert, setShowSubmitErrorAlert] = useState(false);

  const { register, handleSubmit, errors } = useForm<FormData>();

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
              title="Add you own"
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
