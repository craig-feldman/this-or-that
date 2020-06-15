import { Box, Grid, Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import UserContext from "../session/UserContext";
import { ThisAndThatPair, VoteData } from "../types";
import ThisOrThat from "./ThisOrThat";

const ThisOrThatList = () => {
  console.log("Rendering this or that list");
  const user = useContext(UserContext);

  // if (!user) {
  //   return <Typography color="error">Error: No user present</Typography>;
  // }

  const [items, loading, error] = useCollectionData<ThisAndThatPair>(
    db.collection("items").orderBy("createdAt", "desc"),
    {
      idField: "id",
    }
  );

  const [userVotes, loadingVotes, errorVotes] = useCollectionData<VoteData>(
    db.collection(`users/${user!.uid}/votes`),
    {
      idField: "id",
    }
  );

  const findVote = (voteId: string) => {
    return userVotes?.find((item) => item.id === voteId)?.vote;
  };

  return (
    <>
      {console.log({ items })}
      {console.log({ userVotes })}

      {error && <div>Something went wrong ...</div> && console.error(error)}
      {errorVotes && <div>Something went wrong ...</div> &&
        console.error(errorVotes)}

      {(loading || loadingVotes) && (
        <>
          <ThisOrThatListLoadingSkeleton />
          <ThisOrThatListLoadingSkeleton />
        </>
      )}
      {items &&
        userVotes &&
        items.map((item) => (
          <Box key={item.id} marginY={4}>
            <Typography variant="h5" gutterBottom={true}>
              {item.title}
            </Typography>
            <ThisOrThat thisAndThatPair={item} vote={findVote(item.id)} />
          </Box>
        ))}
    </>
  );
};

const ThisOrThatListLoadingSkeleton = () => {
  return (
    <Box marginTop={4}>
      <Typography variant="h5" gutterBottom={true}>
        <Skeleton />
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs>
          <Skeleton height={200} variant={"rect"} />
        </Grid>
        <Grid item xs>
          <Skeleton height={200} variant={"rect"} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThisOrThatList;
