import { useEffect, useState } from "react";
import {
  Button,
  IconMusic,
  IconRadio,
  Input,
  Select,
  Typography,
} from "@supabase/ui";
import { toast } from "react-hot-toast";
import LogInForm from "../components/LogInForm/LogInForm";
import { addCastEntry } from "../utils/supabaseClient";
import Podcast from "../components/Podcast/Podcast";

const Home = ({
  user,
  onLoginSuccess = () => {},
  onSelectLogOut = () => {},
}) => {
  const [url, setUrl] = useState("");
  const [type, setType] = useState("video");
  const isBrowser = typeof window !== "undefined";

  const podcastURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/podcast-xml/${user?.id}.xml`;
  console.log(isBrowser, podcastURL);

  useEffect(() => {}, []);

  const onSubmit = () => {
    try {
      addCastEntry(url, type, user.id);
      toast.success("Item has been queued for processing");
    } catch (err) {
      toast.error(`Oops: ${err.message}`);
    }
  };

  return (
    <>
      <div className="relative min-h-screen">
        <div className="h-full flex-grow flex flex-col">
          <main className="flex flex-col h-full w-full flex-1 text-center text-white">
            {!user ? (
              <div className="w-[400px] h-screen flex items-center mx-auto">
                <LogInForm onLoginSuccess={onLoginSuccess} />
              </div>
            ) : (
              <>
                <div className="absolute top-4 left-4">
                  <Typography.Text small>
                    <span className="text-gray-300">Logged in as:</span>{" "}
                    {user.email}
                  </Typography.Text>
                </div>
                <div className="absolute top-4 right-4">
                  <Button type="secondary" onClick={onSelectLogOut}>
                    Log out
                  </Button>
                </div>

                <div className="w-full bg-gray-700 mx-auto flex flex-col gap-20">
                  <div className="w-[800px] flex justify-between space-y-8 pt-40 pb-28 mx-auto">
                    <div className="flex flex-col justify-start w-3/5 space-y-4 text-left">
                      <Typography.Title level={1}>
                        Welcome to your{" "}
                        <span className="text-green-600">customised</span>{" "}
                        podcast
                      </Typography.Title>
                      <div className="space-y-2 text-left">
                        <Typography.Text>
                          Your personal podcast URL
                        </Typography.Text>
                        <Input value={podcastURL} copy />
                      </div>
                    </div>
                    <div className="w-2/5 flex justify-center relative">
                      <IconMusic size={120} strokeWidth={2} />
                      <IconRadio
                        size={80}
                        strokeWidth={2}
                        className="absolute right-14 -top-12 rotate-45 text-gray-300 animate-pulse"
                      />
                    </div>
                  </div>
                </div>

                <div className="max-w-[1000px] flex w-full mx-auto gap-10">
                  <div
                    className="w-1/4 space-y-4 sticky top-0 py-10"
                    style={{ height: "fit-content" }}
                  >
                    <Typography.Title level={4} className="text-left">
                      Add new entry
                    </Typography.Title>
                    <Input
                      label="Video URL"
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                    />
                    <Select
                      label="Type"
                      onChange={(event) => setType(event.target.value)}
                      value={type}
                    >
                      <Select.Option value="video">video</Select.Option>
                      <Select.Option value="audio">audio</Select.Option>
                    </Select>
                    <div className="w-full flex items-center justify-end">
                      <Button onClick={onSubmit}>Submit</Button>
                    </div>
                  </div>
                  <div className="w-3/4 py-10">
                    <Podcast url={podcastURL} />
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
