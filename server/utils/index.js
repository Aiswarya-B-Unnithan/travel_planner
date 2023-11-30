import bcrypt from "bcrypt";
import JWT from "jsonwebtoken"


export const hashPassword=async(userValue)=>{
const salt= await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(userValue, salt);
return hashedPassword;
}

export const comparePassword = async (password,userPassword) => {
  const isMatch = await bcrypt.compare(password, userPassword);
  return isMatch;
};

//JSONWEB TOKEN
export const createJwt=(id)=>{
    return JWT.sign({ userId: id }, process.env.JWT_SECRET_KEY,
        {expiresIn:"1d"});
}