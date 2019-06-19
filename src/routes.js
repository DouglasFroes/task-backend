module.exports = app =>{
    app.post('/createUser', app.src.api.user.save); 
    app.post('/login', app.src.api.auth.signin);

    app.route('/tasks')
        .all(app.src.config.passport.authenticate())
        .get(app.src.api.tasks.getTasks)
        .post(app.src.api.tasks.add);
        
    
    app.route('/tasks/:id')
        .all(app.src.config.passport.authenticate())
        .delete(app.src.api.tasks.remove);
    
    app.route('/tasks/:id/toggle')
        .all(app.src.config.passport.authenticate())
        .put(app.src.api.tasks.toggleTask);

    app.get('/oi', (req, res)=>{
        res.status(200).send('Meu bar');
    });
}; 