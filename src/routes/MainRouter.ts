import { Router, urlencoded } from "express";
import spotifyService from "../services/SpotifyService";

const main = Router();

main.use(urlencoded({ extended: true }));

main.get("/thumbnail", (req, res) => {
  res.send(`
      <h1>Thumbnail</h1>
      <form action="/thumbnail" method="post">
          <input type="text" name="url" placeholder="Enter URL" />
          <button type="submit">Generate</button>
      </form>
    `);
});

main.post("/thumbnail", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.send("URL is required");
    return;
  }

  // URL Example
  // https://open.spotify.com/track/6SpUnFjNfyFgyLRm65b2G6?si=3b1b1b3b1b3b1b3b
  // Type: track
  // ID: 6SpUnFjNfyFgyLRm65b2G6
  const type = url.split("/")[3].toUpperCase();
  const id = url.split("/")[4].split("?")[0];

  const coverImage = await spotifyService.getCoverImage(type, id);

  console.log(coverImage);

  res.send(`
      <script src="https://cdn.tailwindcss.com"></script>
      <h1>Thumbnail</h1>
      <div class="flex w-auto" id="thumbnail">
        <img src="${coverImage}" />
        <img src="${coverImage}" class="blur-md opacity-75" />
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js" integrity="sha512-7tWCgq9tTYS/QkGVyKrtLpqAoMV9XIUxoou+sPUypsaZx56cYR/qio84fPK9EvJJtKvJEwt7vkn6je5UVzGevw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      <script src="/thumbnail.js"></script>
    `);
});

export default main;
