import { useEffect, useState } from "react";
import PodcastEpisode from "./PodcastEpisode";
import parsePodcast from "node-podcast-parser";

const Podcast = ({ url }) => {
  const [podcastXML, setPodcastXML] = useState("");

  useEffect(async () => {
    const response = await fetch(url);
    const podcastXML = await response.text();
    parsePodcast(podcastXML, (err, data) => {
      console.log(err);
      setPodcastXML(data);
    });
  }, []);

  if (!podcastXML) return "Loading..";
  console.log(podcastXML);
  return (
    <div className="flex flex-col space-y-4">
      {podcastXML.episodes.map((episode) => (
        <PodcastEpisode
          key={episode.title}
          title={episode.title}
          key={episode.guid}
          description={episode.description}
          url={episode.enclosure.url}
          type={episode.enclosure.type}
          image={episode.image}
        />
      ))}
    </div>
  );
};

export default Podcast;
