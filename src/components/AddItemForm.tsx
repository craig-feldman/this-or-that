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
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { db, serverTimestamp } from "../firebase";
import UserContext from "../session/UserContext";
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
  const user = useContext(UserContext);

  const [showSubmitSuccessAlert, setShowSubmitSuccessAlert] = useState(false);
  const [showSubmitErrorAlert, setShowSubmitErrorAlert] = useState(false);

  const { register, handleSubmit, errors, formState } = useForm<FormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const newThisAndThatPair: Omit<
        ThisAndThatPair,
        keyof FirebaseDocument
      > = {
        this: { votes: 0, value: data.this },
        that: { votes: 0, value: data.that },
        title: data.title,
        createdAt: serverTimestamp(),
        userId: user?.uid ?? "",
      };

      await db.collection("items").add(newThisAndThatPair);
      // Hide the new item form
      props.setShowAdd(false);
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
              subheader="Add a 'this or that' item to let the community vote on it!"
            />
            <CardContent>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    inputRef={register({ required: true, maxLength: 60 })}
                    id="add-title"
                    name="title"
                    label="Post title"
                    variant="outlined"
                    fullWidth
                    multiline
                    inputProps={{ style: { textAlign: "center" } }}
                    error={!!errors.title}
                    helperText={
                      (errors.title?.type === "required" &&
                        "Please enter a title for your post.") ||
                      (errors.title?.type === "maxLength" &&
                        "Your title exceeds the maximum length of 60 characters.")
                    }
                    placeholder={`Ask a question! Something like, "Should I travel to South Africa or Kenya?"`}
                  />
                </Grid>
                <Grid item xs={12} sm>
                  <TextField
                    inputRef={register({ required: true, maxLength: 140 })}
                    id="add-this"
                    name="this"
                    label="this"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.this}
                    helperText={
                      (errors.this?.type === "required" &&
                        "Please describe your first option.") ||
                      (errors.this?.type === "maxLength" &&
                        "Your first option exceeds the maximum length of 140 characters")
                    }
                    placeholder="Describe one of the two options that you are deciding between. (max 140 characters)"
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="h5"> VS </Typography>
                </Grid>
                <Grid item xs={12} sm>
                  <TextField
                    inputRef={register({ required: true, maxLength: 140 })}
                    id="add-that"
                    name="that"
                    label="that"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.that}
                    helperText={
                      (errors.that?.type === "required" &&
                        "Please describe your second option.") ||
                      (errors.that?.type === "maxLength" &&
                        "Your second option exceeds the maximum length of 140 characters")
                    }
                    placeholder="Describe the other option. (max 140 characters)"
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={formState.isSubmitting}
                >
                  Submit
                </Button>
                <Button
                  // type="reset"
                  variant="contained"
                  onClick={() => props.setShowAdd(false)}
                  disabled={formState.isSubmitting}
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
