import React from "react";
import { Box, Text } from "@blasterjs/core";

type Props = {
  counts: Record<string, number>;
};

export const SchoolTypeCounts = ({ counts }: Props) => (
  <>
    {Object.entries(counts).map(([schoolType, count], idx) => (
      <Box key={idx} display="flex">
        <Text flex="1">{schoolType}</Text>
        <Text fontWeight="bold" width="50px">
          {count}
        </Text>
      </Box>
    ))}
  </>
);
