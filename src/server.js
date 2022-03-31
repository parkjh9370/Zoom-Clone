import express from "express";

const app = express();

app.set("view engine", "pug");
app.set('views', __dirname + "/views");
// public url 생성해 해당 파일 유저에게 공유
// http://localhost:3000/public/js/index.js
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);