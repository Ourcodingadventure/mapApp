let env = {
  dbUrl:
    "mongodb+srv://mapTeam:theteam1@cluster0.tb9kc.mongodb.net/MapApp?retryWrites=true&w=majority",
  SERVER_SECRET: process.env.SERVER_SECRET || "1234",
  POSTSECRET: process.env.POSTSECRET,
};

module.exports = env;
