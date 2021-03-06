import { Box, Grid, makeStyles, Tooltip } from "@material-ui/core";
import React from "react";
import { Options, ThisAndThatPair } from "../types";
import { ItemCard } from "./ItemCard";

type ThisOrThatProps = {
  thisAndThatPair: ThisAndThatPair;
  vote: Options | undefined;
};

const ThisOrThat = (props: ThisOrThatProps) => {
  const { thisAndThatPair, vote } = props;

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} style={{ paddingBottom: 0 }}>
          <VoteBar
            thisVotes={thisAndThatPair.this.votes}
            thatVotes={thisAndThatPair.that.votes}
          />
        </Grid>
        <Grid item xs={12} sm>
          <ItemCard
            item={thisAndThatPair.this}
            id={thisAndThatPair.id}
            type="this"
            currentVote={vote}
          />
        </Grid>
        <Grid item xs={12} sm>
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

const useVoteBarStyles = makeStyles((theme) => ({
  root: (props: StylesProps) => ({
    background: `linear-gradient(to right, ${theme.palette.primary.main} ${props.percentage}%, ${theme.palette.secondary.main} ${props.percentage}%)`,
    opacity: props.hasVotes ? 1 : 0.2,
    height: "10px",
    borderRadius: "5px",
  }),
}));

type StylesProps = {
  percentage: number;
  hasVotes: boolean;
};

type VoteBarProps = {
  thisVotes: number;
  thatVotes: number;
};
/**
 * Displays a simple bar displaying the vote percentage for 'this' and 'that'.
 *
 * If there are no votes yet, the bar opacity is decreased and a 50/50 vote is shown.
 */
const VoteBar = (props: VoteBarProps) => {
  const { thisVotes, thatVotes } = props;

  const hasVotes = thisVotes > 0 || thatVotes > 0;
  const thisPercentage = hasVotes
    ? (thisVotes / (thisVotes + thatVotes)) * 100
    : 50;

  const styleProps: StylesProps = {
    percentage: thisPercentage,
    hasVotes: hasVotes,
  };
  const classes = useVoteBarStyles(styleProps);

  const tooltipContent = hasVotes
    ? `This: ${thisPercentage.toFixed(0)}%; That ${(
        100 - thisPercentage
      ).toFixed(0)}%`
    : "No votes yet!";

  return (
    <Tooltip title={tooltipContent}>
      <Box className={classes.root}></Box>
    </Tooltip>
  );
};

export default ThisOrThat;
