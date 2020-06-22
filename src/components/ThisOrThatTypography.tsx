import { Typography } from "@material-ui/core";
import React from "react";

const ThisOrThatTypography = () => {
  return (
    <>
      <Typography display="inline" variant="inherit" color="primary">
        This
      </Typography>{" "}
      or{" "}
      <Typography display="inline" variant="inherit" color="secondary">
        That
      </Typography>
    </>
  );
};

export default ThisOrThatTypography;
