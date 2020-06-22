import {
  Box,
  CircularProgress,
  Container,
  createMuiTheme,
  Divider,
  Fab,
  makeStyles,
  responsiveFontSizes,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AddItemForm } from "./components/AddItemForm";
import Footer from "./components/Footer";
import ThisOrThatList from "./components/ThisOrThatList";
import ThisOrThatTypography from "./components/ThisOrThatTypography";
import { auth } from "./firebase";
import UserContext from "./session/UserContext";

function App() {
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    const login = async () => {
      try {
        await auth.signInAnonymously();
      } catch (error) {
        console.error("Error during sign in:", error);
      }
    };

    if (!user && !loading && !error) {
      login();
    }
  }, [error, loading, user]);

  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" height="100vh">
        <Box textAlign="center" flexGrow="1">
          <Container maxWidth="md">
            <Box marginY={4}>
              <Typography variant="h1">
                <ThisOrThatTypography />
              </Typography>
              <Typography variant="subtitle1">
                The fun and easy way to make decisions, and help others do the
                same.
              </Typography>
              <Divider />
            </Box>
            {loading && <CircularProgress />}
            {error && <Typography color="error"> Error: {error}</Typography>}
            {user && (
              <>
                <UserContext.Provider value={user}>
                  <AddOwn />
                  <Box marginTop={5}>
                    <Typography variant="h3">Help others decide</Typography>
                    {/* <Typography variant="subtitle1">
                    Cast your vote for either 'this' or 'that'.
                  </Typography> */}
                    <ThisOrThatList />
                  </Box>
                </UserContext.Provider>
              </>
            )}
          </Container>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
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
