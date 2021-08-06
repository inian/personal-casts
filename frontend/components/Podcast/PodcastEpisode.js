import { Typography } from "@supabase/ui";
import { Card } from "@supabase/ui";

const PodcastEpisode = ({ title, description, url, type, image }) => {
  let cover, episodeDescription;
  if (type == "video/mp4") {
    cover = (
      <div className="flex justify-center">
        <video src={url} controls />
      </div>
    );
    episodeDescription = description;
  } else {
    cover = (
      <div className="flex justify-around">
        <div>
          <img width="100" src={image} />
        </div>
        <div>
          <audio src={url} controls />
        </div>
      </div>
    );
    episodeDescription = (
      <a target="_blank" href={description}>
        {description}
      </a>
    );
  }
  return (
    <>
      <Card title={title} cover={cover}>
        <Typography.Text>{episodeDescription}</Typography.Text>
      </Card>
    </>
  );
};

export default PodcastEpisode;
