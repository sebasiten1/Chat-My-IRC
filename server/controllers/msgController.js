const mongoose = require("mongoose");
const Msg = mongoose.model("Message");
exports.getMessage= async (req, res) => {
    const msg = await Msg.find({});
    res.json(msg);
  };