import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    console.log("All Headers:", req.headers);

  const authHeader = req?.headers?.Authorization; 
  console.log("authHeader", authHeader);

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return next("Authentication failed");
  }

  const token = authHeader?.split(" ")[1];

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.log(error);
    return next("Authentication failed");
  }
};



export default userAuth;
