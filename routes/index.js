var express = require('express');
var router = express.Router();
//Get Home Page
router.get('/', ensureAuthenticated, function(req, res){
    res.render('index');
});
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        console.log('User is not logged in');
        res.redirect('/login');
    }
}
module.exports = router;