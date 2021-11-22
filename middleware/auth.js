module.exports = (req, res, next) => {
  console.log(req.cookies);

  if (
    req.signedCookies.user !== undefined &&
    req.signedCookies.user[2] === true
  ) {
    console.log("in first auth");
    req.isAuthenticated = true;
    res.username = req.signedCookies.user[0];
    // res.role = req.cookies.loggedIn.role;
    console.log("auth true");
    console.log(req.signedCookies.user[0]);
    console.log(req.signedCookies.user[1]);
    next();
  } else {
    // console.log("auth false");
    req.isAuthenticated = false;
    console.log(`Not authorized`);
    next();
  }
};
