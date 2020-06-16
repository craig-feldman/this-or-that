import { Grid } from "@material-ui/core";
import React from "react";
import { Options, ThisAndThatPair } from "../types";
import { ItemCard } from "./ItemCard";

type ThisOrThatProps = {
  thisAndThatPair: ThisAndThatPair;
  vote: Options | undefined;
};

const ThisOrThat = (props: ThisOrThatProps) => {
  const { thisAndThatPair, vote } = props;
  console.log("rendering this or that");

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs>
          <ItemCard
            item={thisAndThatPair.this}
            id={thisAndThatPair.id}
            type="this"
            currentVote={vote}
          />
        </Grid>
        <Grid item xs>
          <ItemCard
            item={thisAndThatPair.that}
            id={thisAndThatPair.id}
            type="that"
            currentVote={vote}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ThisOrThat;
