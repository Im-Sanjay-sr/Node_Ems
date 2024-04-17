const JwtToken = require("jsonwebtoken");

const Token = (req, res, next) => {
  const token = req.cookies.token;

  try {
    const user = JwtToken.verify(token, process.env.MY_Token);
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/user/login");
  }
};

module.exports = { Token };