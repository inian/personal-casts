import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signUp = async (email, password) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email, password) => {
  return await supabase.auth.signIn({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getSession = () => {
  return supabase.auth.session();
};

export const getUser = () => {
  return supabase.auth.user();
};

export const addCastEntry = async (url, type, owner) => {
  console.log("addCastEntry", url, type, owner);
  await fetch(`/api/queue`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("supabase.auth.token")).currentSession
          .access_token
      }`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, type }),
  });
};
