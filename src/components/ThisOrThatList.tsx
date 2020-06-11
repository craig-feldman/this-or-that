import { Box, Grid, Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { ThisAndThatPair } from "../types";
import ThisOrThat from "./ThisOrThat";

const ThisOrThatList = () => {
  console.log("Rendering this or that list");

  const [items, loading, error] = useCollectionData<ThisAndThatPair>(
    db.collection("items").orderBy("createdAt", "desc"),
    {
      idField: "id",
    }
  );

  return (
    <>
      {error && <div>Something went wrong ...</div> && console.error(error)}
      {loading && (
        <>
          <ThisOrThatListLoadingSkeleton />
          <ThisOrThatListLoadingSkeleton />
        </>
      )}
      {items &&
        items.map((item) => (
          <Box key={item.id} marginY={4}>
            <Typography variant="h5" gutterBottom={true}>
              {item.title}
            </Typography>
            <ThisOrThat thisAndThatPair={item} />
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
