import { Box, Divider, Link, Typography } from "@material-ui/core";
import React from "react";

const Footer = () => {
  return (
    <Box marginTop={1}>
      <Divider />
      <Box padding={1}>
        <Typography variant="body2" align="center">
          Site built by{" "}
          <Link
            href="https://craigfeldman.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Craig Feldman
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
