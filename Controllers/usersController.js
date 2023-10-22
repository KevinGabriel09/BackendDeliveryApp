const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys.js');
const { token } = require('morgan');
const storage = require('../utils/cloud_storage.js');
const Rol = require('../models/rol.js');


//capturar datos que envia el cliente
module.exports = {

    findDeliveryMen(req, res) {
        User.findDeliveryMen((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con al listar los repartidores',
                    error: err
                });
            }

            
            return res.status(201).json(data);
        });
    },
    async updateNotificationToken(req, res) {

        const id = req.body.id;
        const token = req.body.token;
        console.log('ID ', id);
        console.log('TOKEN ', token);

        User.updateNotificationToken(id, token, (err, data) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El token se actualizo correctamente',
                data: id
            });
        

        });

    },

    login(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async (err, myUser) => {
            console.log('Error ', err)
            console.log('usuario ', myUser)
            if (err) {
                console.log('Entro el error')
                return res.status(501).json({
                    success: false,
                    message: 'Error al registrar usuario',
                    error: err
                });
            }
            if (!myUser) {
                return res.status(401).json({ //cliente no tiene autorizacion para esta solicitud
                    success: false,
                    message: 'Email no encontrado',
                    error: err
                });
            }
            const isPasswordValid = await bcrypt.compare(password, myUser.password);
            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email },
                    keys.secretOrKey, {})

                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles

                }
                return res.status(201).json({
                    success: true,
                    message: 'El usuario fue autenticado',
                    data: data // recibe el id del nuevo usuario creado
                });
            }
            else {
                return res.status(401).json({ //cliente no tiene autorizacion para esta solicitud
                    success: false,
                    message: 'Contraseña incorrecta',
                    error: err
                });
            }


        })
    },
    register(req, res) {
        const user = req.body;
        User.create(user, (err, data) => {

            if (err) {
                console.log('Entro el error')
                return res.status(501).json({
                    success: false,
                    message: 'Error al registrar usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Registro realizado con exito',
                data: data // recibe el id del nuevo usuario creado
            });
        });
    },
    async registerWithImage(req, res) {
        const user = JSON.parse(req.body.user);
        const files = req.files;
        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.create(user, (err, data) => {

            if (err) {
                console.log('Entro el error')
                return res.status(501).json({
                    success: false,
                    message: 'Error al registrar usuario',
                    error: err
                });
            }

            user.id = `${data}`;
            const token = jwt.sign({ id: user.id, email: user.email },
                keys.secretOrKey, {})
            user.session_token = `JWT ${token}`;

            Rol.create(user.id, 2, (err, data) => {

                if (err) {
                    console.log('Entro el error')
                    return res.status(501).json({
                        success: false,
                        message: 'Error con el registro del rol de usuario',
                        error: err
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: 'Registro realizado con exito',
                    data: user // recibe el id del nuevo usuario creado
                });

            })



        });
    },
    async updateWithImage(req, res) {
        const user = JSON.parse(req.body.user);
        const files = req.files;
        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.update(user, (err, data) => {

            if (err) {
                console.log('Entro el error')
                return res.status(501).json({
                    success: false,
                    message: 'Error al registrar usuario',
                    error: err
                });
            }
            return res.status(201).json({
                success:true,
                message:'usuario actualizado con éxito',
                data: user
            });


        });
    },
    async updateWithOutImage(req, res) {
        const user = req.body
        User.updateWithoutImage(user, (err, data) => {

            if (err) {
                console.log('Entro el error')
                return res.status(501).json({
                    success: false,
                    message: 'Error al registrar usuario',
                    error: err
                });
            }
            return res.status(201).json({
                success:true,
                message:'usuario actualizado con éxito',
                data: user
            });


        });
    },
    async updateNotificationToken(req, res) {

        const id = req.body.id;
        const token = req.body.token;
        console.log('ID ', id);
        console.log('TOKEN ', token);

        User.updateNotificationToken(id, token, (err, data) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El token se actualizo correctamente',
                data: id
            });
        

        });

    },
}
