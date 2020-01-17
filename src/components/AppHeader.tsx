import React from "react";
import { Box, Text } from "@blasterjs/core";

const AppHeader: React.FC = ({ children }) => (
  <Box
    as="header"
    background="lightslategray"
    height="50px"
    p={2}
    display="flex"
    alignItems="center"
  >
    <Text>{children}</Text>
  </Box>
);

export default AppHeader;
