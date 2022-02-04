const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set cross Origin 
app.use(require("cors")());


// Set Route
app.use("/user", require("./routes/user"));
app.use("/chatroom", require("./routes/ChatRoom"));
app.use("/msg", require("./routes/msgRoute"));

//Set Error Handlers
const errorHandlers = require("./handlers/errorHandlers");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
process.env.ENV==="DEVELOPMENT"?app.use(errorHandlers.developmentErrors):app.use(errorHandlers.productionErrors);

//export
module.exports = app;