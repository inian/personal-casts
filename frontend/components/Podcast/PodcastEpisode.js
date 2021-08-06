import { IconExternalLink, Typography } from "@supabase/ui";
import { Card } from "@supabase/ui";

const PodcastEpisode = ({ title, description, url, type, image }) => {
  let cardTitle, cover, episodeDescription;
  if (type == "video/mp4") {
    cardTitle = title;
    cover = (
      <div className="flex justify-center">
        <video src={url} controls />
      </div>
    );
    episodeDescription = description;
  } else {
    cardTitle = (
      <div className="flex items-center space-x-4 w-full">
        <Typography.Text>{title}</Typography.Text>
        <a target="_blank" href={description}>
          <IconExternalLink strokeWidth={2} />
        </a>
      </div>
    );
    cover = (
      <div className="flex items-center justify-center space-x-8">
        <div>
          {image ? (
            <img width="100" src={image} />
          ) : (
            <div className="w-[100px] h-[100px] border-2 border-gray-500 flex items-center">
              <Typography.Text small className="opacity-50">
                No preview available
              </Typography.Text>
            </div>
          )}
        </div>
        <div>
          <audio className="w-[400px]" src={url} controls />
        </div>
      </div>
    );
  }

  return (
    <>
      <Card title={cardTitle}>
        <div>{cover}</div>
        {episodeDescription && (
          <div className="mt-4">
            <Typography.Text>{episodeDescription}</Typography.Text>
          </div>
        )}
      </Card>
    </>
  );
};

export default PodcastEpisode;
