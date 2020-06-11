import {
  Box,
  Container,
  Divider,
  Fab,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
import { AddItemForm } from "./components/AddItemForm";
import ThisOrThatList from "./components/ThisOrThatList";

function App() {
  return (
    <>
      <CssBaseline />

      <Container maxWidth="md">
        <Box textAlign="center">
          <Box marginY={4}>
            <Typography variant="h1">
              <Typography display="inline" variant="inherit" color="primary">
                This
              </Typography>{" "}
              or{" "}
              <Typography display="inline" variant="inherit" color="secondary">
                That
              </Typography>
            </Typography>
            <Typography variant="subtitle1">
              The fun and easy way to make decisions, and help others do the
              same.
            </Typography>

            {/* 
            <Typography variant="body1">
              Struggling to decide what to do for dinner? Want to know whether
              to go for a run or swim?
              <br /> Need help deciding on the better outfit?
              <br />
              Want to know whether to go for a run or swim?
            </Typography> */}
            <Divider />
          </Box>
          <AddOwn />
          <Box marginTop={5}>
            <Typography variant="h3">Help others decide</Typography>
            <ThisOrThatList />
          </Box>
        </Box>
      </Container>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const AddOwn = () => {
  const classes = useStyles();
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  return (
    <Box>
      <Fab
        variant="extended"
        color={showAddItemForm ? "primary" : "secondary"}
        onClick={() => setShowAddItemForm(!showAddItemForm)}
      >
        {!showAddItemForm ? (
          <>
            <ExpandMoreIcon className={classes.extendedIcon} />I need help
            deciding
          </>
        ) : (
          <>
            <ExpandLessIcon className={classes.extendedIcon} />I want to help
            others decide
          </>
        )}
      </Fab>
      {showAddItemForm && <AddItemForm setShowAdd={setShowAddItemForm} />}
    </Box>
  );
};

export default App;
