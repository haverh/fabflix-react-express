
module.exports = function (app) {
    
    app.get('/', (req, res) => {
        console.log(req.oidc.isAuthenticated());
        res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    })
};

