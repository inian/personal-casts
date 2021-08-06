import { Typography } from "@supabase/ui";
import { Card } from "@supabase/ui";

const PodcastEpisode = ({ title, description, url, type }) => {
  let cover;
  if (type == "video/mp4") cover = <video src={url} controls />;
  else cover = <audio src={url} controls />;
  return (
    <>
      <Card title={title} cover={cover}>
        <Typography.Text>{description}</Typography.Text>
      </Card>
    </>
  );
};

export default PodcastEpisode;
