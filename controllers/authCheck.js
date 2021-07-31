const authCheck = function authCheck(req, res, next){
    if (req.session.currentUser) {
        next();
    }
    else{
        res.redirect("/");
    }
}

module.exports = authCheck;