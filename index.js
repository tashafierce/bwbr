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
  database: "",
  password: "",
  port: 5432,
});

// END

db.connect();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const config = { // WARNING: should probably remove this if deploying to production, it is unsafe
  httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
};

app.get("/", async (req, res) => {
  try {
    const result = await db.query("select * from reviews"); // we want all columns, so select all
    if (!result.rows) { // check for no results
      return res.render("index.ejs", {
        error: "noResult",
      });
    };
    if (req.query.msg) { // check to see if we got to this route via error
      var errorMessage = req.query.msg;
      console.log(typeof errorMessage);
      return res.render('index.ejs', {
        error: errorMessage,
        reviews: result.rows,
      });
    };
    res.render("index.ejs", {
      reviews: result.rows,
    });
  } catch (err) {
    console.log(err);
  }
});


app.post("/add", async (req, res) => {
  const newReview = req.body;
  const date = new Date();
  try { // check API to see if book exists 
      const image = await axios.get(apiURL + newReview.isbn + ".json", config); // update config if you removed/changed constant
        console.log(image.data.filename_l);
        const imagePath = apiURL + newReview.isbn + "-M.jpg";
        console.log(imagePath);
        const result = await db.query("insert into reviews (title, author, description, rating, date_entered, image_path, review, isbn, reviewer) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *;", [newReview.title, newReview.author, newReview.description, newReview.rating, date, imagePath, newReview.review, newReview.isbn, newReview.reviewer]);
         console.log(result.rows);
    } catch (err) {      
       if (err.response.status === 404) { // API will return status 404 if there is no matching ISBN
        var s = encodeURIComponent('noBook');
       return res.redirect('/?msg=' + s); // send 404 error message back to root route
      } else { // check for other errors
        var s = encodeURIComponent('unk');
        return res.redirect('/?msg=' + s);
      }; 
      console.log(err);
    };
    res.redirect("/");
   });

app.post("/edit", async (req, res) => {
 const editedReview = req.body;
 const reviewId = parseInt(editedReview.id);
   try {
    const image = await axios.get(apiURL + editedReview.isbn + ".json", config);
      const imagePath = apiURL + editedReview.isbn + "-M.jpg";
      const result = await db.query("update reviews set title = $1, author = $2, description = $3, rating = $4, image_path = $5, review = $6, isbn = $7, reviewer = $8 where id = $9 returning *;", [editedReview.title, editedReview.author, editedReview.description, parseInt(editedReview.rating), imagePath, editedReview.review, editedReview.isbn, editedReview.reviewer, parseInt(editedReview.review_id)]);
  } catch (err) {
    if (err.response.status === 404) {
      var s = encodeURIComponent('noBook');
     return res.redirect('/?msg=' + s);
    } else {
      var s = encodeURIComponent('unk');
      return res.redirect('/?msg=' + s);
    }; 
    console.log(err);
  };
  res.redirect("/");
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