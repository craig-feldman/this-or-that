import {
  Box,
  Divider,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@material-ui/core";
import GitIcon from "@material-ui/icons/GitHub";
import React from "react";

const Footer = () => {
  return (
    <Box marginTop={1}>
      <Divider />
      <Box
        padding={1}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="body2" align="center">
          Site built by{" "}
          <Tooltip title="View my personal website">
            <Link
              href="https://craigfeldman.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Craig Feldman's personal website"
            >
              Craig Feldman
            </Link>
          </Tooltip>
        </Typography>
        <Tooltip title="GitHub repository">
          <IconButton
            href="https://github.com/craig-feldman/this-or-that"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            aria-label="View GitHub repository."
          >
            <GitIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Footer;
