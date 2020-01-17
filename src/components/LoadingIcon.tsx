import React from "react";
import { Icon } from "@blasterjs/core";

import styled, { keyframes } from "styled-components";

const StyledIcon = styled(Icon)`
  animation: 2s ${keyframes`
    to {
      transform: rotate(360deg);
    }
  `} linear infinite;
`;

export default () => (
  <StyledIcon name="load" size="24px" alignSelf="center" m="auto" color="gray500" />
);
