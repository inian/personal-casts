import { useEffect, useState } from "react";
import { Typography } from "@supabase/ui";

const PodcastEpisode = ({ title, description, url, type }) => {
  return (
    <>
      <div className="flex w-full justify-center">
        {type === "video/mp4" && <video width="300" src={url} controls />}
        {type === "audio/mp3" && <audio width="300" src={url} controls />}
      </div>

      <Typography.Title level={3}>{title}</Typography.Title>
      <Typography.Text>{description}</Typography.Text>
      <br />
      <br />
    </>
  );
};

export default PodcastEpisode;
