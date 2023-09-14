
module.exports = function (app) {
    
    app.get('/', (req, res) => {
        res.send("Server is running.");
    })
};

