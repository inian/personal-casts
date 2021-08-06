import { useEffect, useState } from "react";
import { Button, Input, Select, Typography } from "@supabase/ui";
import { toast } from "react-hot-toast";
import LogInForm from "../components/LogInForm/LogInForm";
import { addCastEntry } from "../utils/supabaseClient";

const Home = ({
  user,
  onLoginSuccess = () => {},
  onSelectLogOut = () => {},
}) => {
  const [url, setUrl] = useState("");
  const [type, setType] = useState("video");

  useEffect(() => {}, []);

  const onSubmit = () => {
    const { data, error } = addCastEntry(url, type, user.id);
    console.log(data, error);
    if (!error) {
      toast.success("Yay entry added");
    } else {
      toast.error(`Oops: ${error.message}`);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden h-screen">
        <div className="max-w-screen-xl h-full mx-auto flex-grow flex flex-col">
          <main className="flex flex-col h-full items-center justify-center w-full flex-1 px-20 text-center text-white">
            {!user ? (
              <div className="w-[400px] mx-auto">
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
                <div className="w-[400px] space-y-4">
                  <Typography.Title level={3} className="text-left">
                    Add entry to personal casts
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
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
