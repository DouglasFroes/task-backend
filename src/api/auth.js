const jwt = require ('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

const { authSecret } = require('../../.env');

module.exports = app => {
    const signin = async ( req, res)=>{
        if(!req.body.email || !req.body.password){
            return res.status(400).send('dados invalidos');
        }
        const user = await app.db('users')
            .where({email: req.body.email})
            .first();

        if(user){
            bcrypt.compare(req.body.password, user.password, (err, isMatch)=>{
                if(err|| !isMatch){
                     return res.status(401).send('senha invalida')
                }

                const payload = {id : user.id};

                res.json({
                    name: user.name,
                    email: user.email,
                    token: jwt.encode(payload, authSecret)
                });
        })
        }else{
            res.status(400).send('email não encontrado');
        }
    }
    return { signin }
}