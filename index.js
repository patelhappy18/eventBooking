require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const session = require("express-session");
const MongoStore = require("connect-mongo");

const oneDay = 1000 * 60 * 60 * 24;

const connectDB = require("./db/connect");

const users = require("./routes/users");

const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // from MongoDB Atlas or local Mongo
      collectionName: "sessions",
    }),
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

app.use("/users", users);

app.get("/", (req, res) => {
  res.render("dashboard");
});

app.get("/admin/scan", (req, res) => {
  res.render("scanner"); // shows the scanner page
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    app.listen(port, function () {
      console.log(`Express server listening on port ${port} `);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
