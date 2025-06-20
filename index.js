require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const session = require("express-session");
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
    secret: "keythatwillsignedthecookie",
    saveUninitialized: true,
    resave: false, // RESAVE Means for every request to the server we need new cookie
    cookie: { maxAge: oneDay },
  })
);

app.use("/users", users);

app.get("/", (req, res) => {
  res.render("dashboard");
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
