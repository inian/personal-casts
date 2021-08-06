import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Toaster, toast } from "react-hot-toast";
import * as Portal from "@radix-ui/react-portal";
import { getSession, getUser, signOut } from "../utils/supabaseClient";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    document.body.className = "dark";

    if (router.asPath.includes("access_token")) {
      setTimeout(() => {
        const sessionUser = getUser();
        if (sessionUser) setUser(sessionUser);
      }, 200);
      return toast.success("Successfully confirmed email - welcome!", {
        icon: "😎",
      });
    }

    const session = getSession();
    if (session) {
      const sessionExpired =
        session.expires_at <= Math.floor(Date.now() / 1000);
      if (sessionExpired) {
        toast("Your session is expired, please log in again");
        return localStorage.removeItem("supabase.auth.token");
      }
      const sessionUser = getUser();
      if (sessionUser) setUser(sessionUser);
    }
  }, []);

  const [user, setUser] = useState(null);

  const onLoginSuccess = (sessionUser, session) => {
    if (!session) {
      toast("Check your email to confirm your account!", { icon: "✉️" });
    } else {
      toast.success(`Successfully logged in! 😄`);
      setUser(sessionUser);
    }
  };

  const onSelectLogOut = async () => {
    await signOut();
    toast.success("Successfully logged out 👋🏻");
    setUser(null);
  };

  return (
    <div className="bg-gray-800 relative">
      <Head>
        <title>Personal Casts</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/css/fonts.css" />
      </Head>
      <Component
        {...pageProps}
        user={user}
        onLoginSuccess={onLoginSuccess}
        onSelectLogOut={onSelectLogOut}
      />
      <Portal.Root className="portal--toast">
        <Toaster
          toastOptions={{
            className:
              "dark:bg-bg-primary-dark dark:text-typography-body-strong-dark border border-gray-500",
            style: {
              padding: "8px",
              paddingLeft: "16px",
              paddingRight: "16px",
              fontSize: "0.875rem",
            },
          }}
        />
      </Portal.Root>
    </div>
  );
}

export default MyApp;
