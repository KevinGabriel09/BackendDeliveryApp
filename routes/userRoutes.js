const usersControllers = require('../Controllers/usersController');
const passport = require('passport')

module.exports = (app, upload) => {

    //post guardado de datos
    
    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', { session: false }), usersControllers.findDeliveryMen);
    

    app.post('/api/users/create', usersControllers.register);
    app.post('/api/users/createWithImage', upload.array('image',1),usersControllers.registerWithImage);
    app.post('/api/users/login', usersControllers.login);

    app.put('/api/users/update',passport.authenticate('jwt', {session: false}),upload.array('image',1),usersControllers.updateWithImage)

    app.put('/api/users/updateWithOutImage',passport.authenticate('jwt', {session: false}), usersControllers.updateWithOutImage)
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt', {session: false}), usersControllers.updateNotificationToken);
    
}
