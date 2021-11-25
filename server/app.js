const express = require("express")
const app = express()

app.get("/", function(req, res) {
  res.send("It's working!")
})

app.listen(8000, () => {
  console.log("app listening on port 8000")
})