const User  = require('../../models/user');
const {SERVER_URL} = require('../../config/conf')
const jwt = require("jwt-simple");

exports.register = async (req, res) => {
    let errors = [];
    if (!req.body.username) {
        errors.push({ text: 'Please Enter UserName.' });
    }
    if (!req.body.wallet) {
        errors.push({ text: 'Please Enter Address.' });
    }
    if (!req.body.badge) {
        errors.push({ text: 'Please Enter Badge Name.' });
    }
    if (!req.body.dao) {
        errors.push({ text: 'Please Enter DAO address.' });
    }
    if (errors.length > 0) {
        res.status(200).send({success: false, error: errors});
    } else {
        User.findOne({ wallet: req.body.wallet }).then((user) => {
            if (user) {
               res.redirect(SERVER_URL + '/admin');
            } else {
                const user = new User({
                    username: req.body.username,
                    wallet: req.body.wallet,
                    badge: req.body.badge,
                    dao: req.body.dao
                });
                user.save().then((result) => {
                    res.redirect(SERVER_URL + '/admin');
                }).catch((err) => {
                    res.status(200).send({success: false});
                });
            }
        });
    }
}

exports.login = async(req, res) => {
    User.findOne({ wallet: req.body.wallet }, (err, user) => {
        if (err) {
            res.send("Error Happened In auth /token Route");
        } else {
            if (user)
            {
                res.json({
                    success: true,
                    url: '/onerepboard'
                });
            }
            else
                res.json({
                    success: true,
                    url: '/walletconnect'
                });
        }
    }); 
}

exports.logout = async(req,res)=>{
    req.logout();
    res.status(200).send({success: true});
}

exports.getUserList = async(req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users);
    });
}

exports.getOneRepBoard = async(req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users);
    });
}

exports.update = async (req, res) => {
    User.findOne({wallet: req.body.wallet}).then((user) => {
        var puser = user;
        if (req.body._id == '')
        {
            if (user)
            {
                return res.status(200).send({error: "ETH address duplicated!", success: false});
            }
            else
            {
                puser = new User({
                    username: req.body.username,
                    wallet: req.body.wallet,
                    badge: req.body.badge,
                    dao: req.body.dao,
                    isAdmin: req.body.isAdmin,
                    status: req.body.status
                });
            }
        }
        else
        {
            if (!puser)
            {
                return res.status(200).send({error: "This accout does not exist!", success: false});
            }
            else
            {
                puser.username = req.body.username;
                puser.wallet = req.body.wallet;
                puser.badge = req.body.badge;
                puser.dao = req.body.dao;
                puser.isAdmin = req.body.isAdmin;
                puser.status = req.body.status;
            }
        }
        puser.save().then((result) => {
            User.find({}).then((users) => {
                res.status(200).send({users: users, success: true});
            });
        }).catch((err) => {
            res.status(200).send({success: false, error: "Error Occured!"});
        });
    });
}

exports.delete = async (req, res) => {
    User.deleteOne({ _id: req.body._id }).then((user) => {
        User.find({}).then((users) => {
            res.status(200).send(users);
        });
    });
}

