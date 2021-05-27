let PORT = process.env.PORT || 5000;
let express = require("express")
let app = express()

let http = require("http")
let server = http.Server(app)

app.use(express.static("static"))

server.listen(PORT, function() {
  console.log("Shapor running...");
})

