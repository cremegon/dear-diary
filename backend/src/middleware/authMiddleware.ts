const verifyToken = require("./validateToken");

function authMiddleware(req,res,next){
    const token = req.cookies.authToken

    if (!token) { 
        return res.status(401).json({message: "NO Token present"})
    }

    const result = verifyToken(token)
    if (!)
}