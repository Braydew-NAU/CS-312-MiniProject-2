const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Routes
// home page with form
app.get("/", (req, res) => {
    res.render("index");
});

// seaerch cocktails by name
app.post("/search", async (req, res) => {
    try {
      const searchTerm = req.body.name;
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();
  
      if (data.drinks) {
        res.render("result", { cocktails: data.drinks }); // array already
      } else {
        res.render("result", { cocktails: [] });
      }
    } catch (error) {
      res.render("error", { message: "Could not fetch cocktails." });
    }
  });

app.get("/drink/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const response = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const drink = response.data.drinks ? response.data.drinks[0] : null;
  
      if (drink) {
        res.render("drink", { drink });
      } else {
        res.render("error", { message: "Cocktail not found." });
      }
    } catch (error) {
      console.error(error);
      res.render("error", { message: "Error fetching cocktail details." });
    }
  });

// random cocktail
app.get("/random", async (req, res) => {
    try {
      const response = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php");
      const data = await response.data;

      if (data.drinks && data.drinks.length > 0) {
        const cocktail = data.drinks[0];
        res.render("drink", { drink: cocktail }); // wrap single in array
      } else {
        res.render("error", { message: "No cocktail found." });
      }
    } catch (error) {
      res.render("error", { message: "Could not fetch random cocktail." });
    }
  });

// listening
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


