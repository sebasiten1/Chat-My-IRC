const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");

exports.createChatroom = async (req, res) => {
  const { name } = req.body;

  const chatroomExists = await Chatroom.findOne({ name });

  if (chatroomExists) throw "Chatroom with that name already exists!";

  const chatroom = new Chatroom({
    name,
  });

  await chatroom.save();

  res.json({
    message: "Chatroom created!",
  });
};

exports.getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({});

  res.json(chatrooms);
};

exports.updateChatRooms = async (req, res) => {
  const filter = req.body._id;
  const update = req.body.name;
  await Chatroom.findOneAndUpdate(filter, update);
  res.json({
    message: "Chatroom Modyfied!",
  })
}

exports.deleteChatrooms = async (req, res) =>{
  const id = req.body;
  await Chatroom.findOneAndDelete({id});
  res.json({
    message: "Chatroom delete!",
  })
}