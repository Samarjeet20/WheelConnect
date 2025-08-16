const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

// Authentication middleware
const adminMiddleware = async (req, res, next) => {
    let token = req.headers.authorization;
    if(!token) return res.status(401).json({message: "Unauthorized Access"})
    token = token.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await Admin.findOne({email: decoded.email}).lean();
        if(user.usertype != 'Admin') return res.status(401).json({message: "Unauthorized Access"});
        req.user = {...user, id: user._id};
        next()

    }catch(err){

        return res.status(401).json({message: "Unauthorized access"})
    }

}

module.exports = adminMiddleware;