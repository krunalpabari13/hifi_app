import DBConnect from "../DBConnect";
import registerModel from "../models/registerModel";
import bycrpt from "bcrypt";
export default async function registerController(req, res) {
  try {
   
    const model = registerModel();
    const { username, email, password, avatar_url } = req.body;
    const checking = await model.find({ $or:[ {username: username}, {email: email}] });

    if (checking.length === 0) {
      bycrpt.hash(password, 2, (err, done) => {
        new model({
          username: username,
          email: email,
          password: done,
          avatar_url: avatar_url,
        }).save();

        res.status(200).json({ success: "registered successfuly" });
      });
    } else {
      res.status(200).json({ error: "Username or email already Exists" });
    }
  } catch (error) {
    res.status(400).json({ error: "some internal error" });
  }
}
