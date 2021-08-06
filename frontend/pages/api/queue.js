// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Client } = require("pg");
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default async function queue(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "HTTP method not supported" });
  }

  const token = req.headers.authorization.split(" ")[1];
  console.log(req.headers.authorization, token);
  const { user } = await supabase.auth.api.getUser(token);
  if (!user) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  const { url, type } = req.body;
  const client = new Client();
  await client.connect();
  await client.query(
    `insert into "queue-jobs"(video_url, type, owner) values($1, $2, $3)`,
    [url, type, user.id]
  );
  res.status(200).json({ message: "Queued" });
}
