import server from "./config/server";
import DataManager from "./model/DataManager";
import { setDataManager } from "./controller/ApiController";

// Can replace these with other files as long as they conform to the same format.
const MOVIES_CSV_FILE = "./movies_large/movies.csv";
const RATINGS_CSV_FILE = "./movies_large/ratings.csv";
const USERS_CSV_FILE = "./movies_large/users.csv";

const port = process.env.PORT || 8888;

const dataManager = new DataManager(USERS_CSV_FILE, RATINGS_CSV_FILE, MOVIES_CSV_FILE);

dataManager.on("done", () => {
  setDataManager(dataManager);
  console.log("Data loaded! Starting server...");

  server()
    .listen(port, () => {
      console.log("Server has been started.");
      console.log("Terminate using Ctrl-C.");
    });
});
