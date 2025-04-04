import User from '../models/user.models.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from '../mailtrap/emails.js';
import crypto from 'crypto';

export const signup = async(req,res)=>{
    const { email, password, name } = req.body;

    try {
        if(!email || !password || !name){
            return res.status(400).json({message: 'All fields are mandatory'});
        }

        const userAlreadyExists = await User.findOne({email});

        if(userAlreadyExists){
            return res.status(400).json({success: false,message:'User already exists'});
        }

        // verification token is just OTP
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await User.create({name,email,password,name,verificationToken,verificationTokenExpiresAt:Date.now() + 24 * 60 * 60 * 1000});

        const token = await user.generateToken();

        await sendVerificationEmail(user.email,verificationToken);

        res.cookie('token',token,{httpOnly: true});

        res.status(200).json({success:true,message:'User created successfully',user:{...user._doc,password:undefined}});
    } catch (error) {
        console.log('Error ',error.message);
    }
}


export const verifyEmail = async(req,res)=>{
    // read the verification code from the user
    // find the user by verification code
    // and it should be within the expiry date

    // if code is correct the make isVerified as true
    // delete the verificationToken and verificationTokenExpiresAt i.e set it to undefined
    // finally send the welcome email to the user

    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if(!user){
            return res.status(400).json({success:false,message:'Invalid or expired verification code'});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email,user.name);

        res.status(200).json({success:true,message:'Code verified successfully'});
    } catch (error) {
        console.error('Error ',error.message);
    }
}

export const login = async(req,res)=>{
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({success:false, message:'Invalid credentials'});
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if(!isPasswordCorrect){
            return res.status(400).json({success:false,message:'Invalid credentials'});
        }

        const token = await user.generateToken();

        res.cookie('login_cookie',token);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({success:true,message:'User logged in'});
    } catch (error) {
        console.error('Error ',error.message);
    }
}

export const logout = async(req,res)=>{
    res.clearCookie('token');

    res.status(200).json({success: true,message:'logged out'});
}

export const forgotPassword = async(req,res)=>{
    const { email } = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({success:false, message:'User not found'});
        }

        // generate token for password reset
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        console.log(`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({success:true, message: 'Password reset link sent to your email'});
    } catch (error) {
        console.error('Error ',error.message);
    }   
}

export const resetPassword = async (req,res)=>{
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if(!user){
            return res.status(200).json({success: false,message: 'Invalid or expired reset token'});
        }

        // update the password
        user.password = password;

        user.resetPasswordExpiresAt = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success: true, message: 'Password reset success',user})

    } catch (error) {
        console.error('Error ',error.message);
    }
}

export const checkAuth = async(req,res)=>{
    try {
        res.json(req.user);
    } catch (error) {
        console.error('Error ',error.message);
    }
}