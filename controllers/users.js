module.exports.createUser = function(req, res) {
  console.log("Someone brave guy requested a new user");
  return res.send("A user has been created!!");
};
