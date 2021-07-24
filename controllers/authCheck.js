const authCheck = function authCheck(req, res, next){
    if (req.session.currentUser) {
        next();
    }
    else{
        res.redirect("/user/login");
    }
}

module.exports = authCheck;