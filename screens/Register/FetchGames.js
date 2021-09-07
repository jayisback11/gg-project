import { CLIENT_ID, CLIENT_SECRET } from "@env";


const fetchGames = async ({ search, token }) => {
  await fetch("https://api.igdb.com/v4/search", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "Client-ID": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    body: `fields *; search "${search}"; limit 10;`,
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((error) => alert(error));
};
const authenticate = async () => {
  await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {return data.access_token});
};
export { fetchGames, authenticate };
