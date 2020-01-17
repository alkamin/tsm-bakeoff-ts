import React from "react";
import { Blaster } from "@blasterjs/core";
import { createGlobalStyle } from "styled-components";

const FullSizeStyles = createGlobalStyle`
  html,
  body {
    box-sizing: border-box;
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    align-items: stretch;
  }
`;

const AppContainer: React.FC = ({ children }) => (
  <Blaster>
    <FullSizeStyles />
    {children}
  </Blaster>
);

export default AppContainer;
