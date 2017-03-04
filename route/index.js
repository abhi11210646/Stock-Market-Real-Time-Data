module.exports = (app, websockets) => {
        app.use('/api', require('./routes')(websockets));
};