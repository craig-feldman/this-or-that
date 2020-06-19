import { Box, Chip, Grid, Typography } from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useContext, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, documentId } from "../firebase";
import UserContext from "../session/UserContext";
import { ThisAndThatPair, VoteData } from "../types";
import ThisOrThat from "./ThisOrThat";

const ThisOrThatList = () => {
  console.log("Rendering this or that list");
  const user = useContext(UserContext);

  const [items, loadingItems, errorItems] = useCollectionData<ThisAndThatPair>(
    db.collection("items").orderBy("createdAt", "desc").limit(10),
    {
      idField: "id",
    }
  );

  const [userVotes, loadingVotes, errorVotes] = useCollectionData<VoteData>(
    user &&
      items &&
      db.collection(`users/${user.uid}/votes`).where(
        documentId(),
        "in",
        items.map((item) => item.id)
      ),
    {
      idField: "id",
    }
  );

  const loading = useMemo(() => loadingItems || loadingVotes, [
    loadingItems,
    loadingVotes,
  ]);

  const findVote = (voteId: string) => {
    return userVotes?.find((item) => item.id === voteId)?.vote;
  };

  return (
    <>
      {console.log({ items })}
      {console.log({ userVotes })}

      {errorItems && <div>Something went wrong ...</div> &&
        console.error(errorItems)}
      {errorVotes && <div>Something went wrong ...</div> &&
        console.error(errorVotes)}

      {loading && (
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
              {item.title}{" "}
              {user?.uid === item.userId && (
                <Chip label="yours" icon={<FaceIcon />} size="small" />
              )}
            </Typography>

            <ThisOrThat
              key={item.id}
              thisAndThatPair={item}
              vote={findVote(item.id)}
            />
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
        <Grid item xs={12} sm>
          <Skeleton height={200} variant={"rect"} />
        </Grid>
        <Grid item xs={12} sm>
          <Skeleton height={200} variant={"rect"} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThisOrThatList;
