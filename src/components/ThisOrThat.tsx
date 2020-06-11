import { Grid } from "@material-ui/core";
import React from "react";
import { ThisAndThatPair } from "../types";
import { ItemCard } from "./ItemCard";

type ThisOrThatProps = {
  thisAndThatPair: ThisAndThatPair;
};

const ThisOrThat = (props: ThisOrThatProps) => {
  const { thisAndThatPair } = props;
  console.log("rendering this or that");

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs>
          <ItemCard
            item={thisAndThatPair.this}
            id={thisAndThatPair.id}
            type="this"
          />
        </Grid>
        <Grid item xs>
          <ItemCard
            item={thisAndThatPair.that}
            id={thisAndThatPair.id}
            type="that"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ThisOrThat;
