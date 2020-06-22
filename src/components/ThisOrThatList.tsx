import { Box, Chip, Divider, Grid, Typography } from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useContext, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, documentId } from "../firebase";
import UserContext from "../session/UserContext";
import { ThisAndThatPair, VoteData } from "../types";
import ThisOrThat from "./ThisOrThat";
import ThisOrThatTypography from "./ThisOrThatTypography";

const MAX_LIST_SIZE = 5;

const ThisOrThatList = () => {
  const user = useContext(UserContext);

  const [items, loadingItems, errorItems] = useCollectionData<ThisAndThatPair>(
    db.collection("items").orderBy("createdAt", "desc").limit(MAX_LIST_SIZE),
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
      {errorItems && (
          <Typography color="error">Something went wrong ...</Typography>
        ) &&
        console.error(errorItems)}
      {errorVotes && (
          <Typography color="error">Something went wrong ...</Typography>
        ) &&
        console.error(errorVotes)}

      {loading && (
        <>
          <ThisOrThatListLoadingSkeleton />
          <ThisOrThatListLoadingSkeleton />
        </>
      )}
      {items && userVotes && (
        <>
          {items.map((item, index) => (
            <>
              <Box key={item.id} marginY={4}>
                <Typography variant="h4" gutterBottom={true}>
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
              {index !== items.length - 1 && <Divider variant="middle" />}
            </>
          ))}
          <Typography gutterBottom variant="caption">
            To keep things relevant, we only display a maximum of{" "}
            {MAX_LIST_SIZE} recent <ThisOrThatTypography /> items.
          </Typography>
        </>
      )}
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
        <Grid item xs={12} style={{ paddingBottom: 0 }}>
          <Skeleton height={10} variant={"rect"} />
        </Grid>
        <Grid item xs={12} sm>
          <Skeleton height={150} variant={"rect"} />
        </Grid>
        <Grid item xs={12} sm>
          <Skeleton height={150} variant={"rect"} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThisOrThatList;
