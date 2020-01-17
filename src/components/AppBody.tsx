import React, { forwardRef, ReactNode, ForwardRefExoticComponent } from "react";
import { Box } from "@blasterjs/core";
import styled from "styled-components";

type BodyFC = {
  Sidebar: typeof AppSidebar;
  Main: typeof AppMain;
} & React.FC;

const AppSidebar: React.FC = ({ children, ...props }) => (
  <Box background="coral" width="300px" overflow="auto" p={2} {...props}>
    {children}
  </Box>
);

const AppMain = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children }, ref) => (
    <Box background="burlywood" flex="1" ref={ref}>
      {children}
    </Box>
  )
);

const AppBody: BodyFC = ({ children, ...props }) => (
  <Box as="main" background="blue" display="flex" flex="1" {...props}>
    {children}
  </Box>
);

AppBody.Sidebar = AppSidebar;
AppBody.Main = AppMain;

export default AppBody;
