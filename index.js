import express from "express";
import pg from "pg";
import https from "https";
import axios from "axios";

const app = express();
const port = 3000;
const apiURL = "https://covers.openlibrary.org/b/isbn/";

// BEGIN: CHANGE THE BELOW VALUES IF DEPLOYING

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book",
  password: "User-Error-2025!",
  port: 5432,
});

// END

db.connect();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const config = {
  httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
};

app.get("/", async (req, res) => {
  const result = await db.query("select * from reviews");
    if (result.rows) {
      res.render("index.ejs", {
        reviews: result.rows,
      });
    } else {
      res.render("index.ejs");
    };
});

app.post("/add", async (req, res) => {
  const newReview = req.body;
  const date = new Date();

  try {
      const image = await axios.get(apiURL + newReview.isbn + ".json", config);
      if (image.data.filename_l) {
        console.log(image.data.filename_l);
        const imagePath = apiURL + newReview.isbn + "-M.jpg";
        console.log(imagePath);
        var user = await db.query("select * from users where id = $1;", [newReview.user]);
        user = parseInt(user.id);
        console.log(user);
        const result = await db.query("insert into reviews (title, author, description, rating, date_entered, image_path, user_id, review, isbn, reviewer) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *;", [newReview.title, newReview.author, newReview.description, newReview.rating, date, imagePath, user, newReview.review, newReview.isbn, newReview.reviewer]);
        console.log(result.rows);
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    };
   });

app.post("/edit", async (req, res) => {
 const editedReview = req.body;
 const reviewId = parseInt(editedReview.id);
  
  try {
    const image = await axios.get(apiURL + editedReview.isbn + ".json", config);
    if (image.data.filename_l) {
      const imagePath = apiURL + editedReview.isbn + "-M.jpg";
      const result = await db.query("update reviews set title = $1, author = $2, description = $3, rating = $4, image_path = $5, user_id = $6, review = $7, isbn = $8, reviewer = $9 where id = $10 returning *;", [editedReview.title, editedReview.author, editedReview.description, parseInt(editedReview.rating), imagePath, parseInt(editedReview.user_id), editedReview.review, editedReview.isbn, editedReview.reviewer, parseInt(editedReview.review_id)]);
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  };
});

app.get("/delete/:id", async (req, res) => {
  const reviewId = parseInt(req.params.id);
  try {
    const result = await db.query("delete from reviews where id = $1;", [reviewId]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  };
});

app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});