import React from "react";
import { Stack, Box } from "@mui/material";

import { ChannelCard, Loader, VideoCard } from "./";

const Videos = ({ videos, direction }) => {
  // console.log("videos:", videos)
  if(!videos?.length) return <h1>hihi</h1>;
  //test

  return (
    <Stack direction={direction || "row"} flexWrap="wrap" justifyContent="start" alignItems="start" gap={2}>

      {videos?.map((item, idx) => {

        return <Box key={idx}>
          {item.video_id && <VideoCard video={item} />}
     
        </Box>
      })}

      
    </Stack>
  );
}

export default Videos;
