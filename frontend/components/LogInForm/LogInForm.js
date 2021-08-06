import {
  Button,
  IconKey,
  IconLock,
  IconMail,
  Input,
  Typography,
} from "@supabase/ui";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signUp, signIn } from "../../utils/supabaseClient";

const LogInForm = ({ onLoginSuccess = () => {} }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("SIGN_IN");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setView("SIGN_IN");
  }, []);

  const toggleView = () => {
    if (view === "SIGN_IN") {
      return setView("SIGN_UP");
    }
    return setView("SIGN_IN");
  };

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const onSignIn = async (event) => {
    event.preventDefault();

    if (!email) {
      return toast.error("Please enter an email address");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    if (!password) {
      return toast.error("Please enter a password");
    }

    setLoading(true);
    const { user, session, error } =
      view === "SIGN_IN"
        ? await signIn(email, password)
        : await signUp(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      onLoginSuccess(user, session);
    }
  };

  return (
    <div className="flex w-full pb-4">
      <div className="flex-1 space-y-4">
        <form onSubmit={onSignIn} className="space-y-8">
          <div className="flex flex-col space-y-4">
            <Input
              label="Email address"
              icon={<IconMail className="text-gray-400" />}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              label="Password"
              icon={<IconKey className="text-gray-400" />}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button block size="medium" icon={<IconLock />} loading={loading}>
            {view === "SIGN_IN" ? "Sign in" : "Sign up"}
          </Button>
        </form>
        <div className="text-center cursor-pointer" onClick={toggleView}>
          <Typography.Text className="transition !text-green-700 hover:!text-green-500">
            {view === "SIGN_IN"
              ? "Don't have an account? Sign up"
              : "Have an account? Sign in"}
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
