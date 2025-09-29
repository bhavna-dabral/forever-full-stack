import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: COOKIE_MAX_AGE,
});

const createToken = (id) => {
    return jwt.sign(id, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Route for user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'Missing details' })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Email doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const token = createToken({ id: user._id });
        res.cookie(COOKIE_NAME, token, getCookieOptions());

        return res.status(200).json({ success: true, token,  message: "Logged in successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Route for user register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' });
    }
    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a password with at least 8 characters" });
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        const token = createToken({ id: user._id });
        res.cookie(COOKIE_NAME, token, getCookieOptions());

        //Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Forever',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #4CAF50;">Welcome to Forever!</h2>
                <p>Hello <strong>${name}</strong></p>
                <p>Your account has been successfully created with <strong>Email ID:</strong> ${email}</p>
                <p>We're excited to have you on board. If you have any questions, feel free to reach out.</p>
                <p>Happy Shopping</p>
                <br>
                <p>Best regards,<br>The Forever Team</p>
            </div>
        `
        }

        await transporter.sendMail(mailOptions)

        return res.status(201).json({ success: true, token, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Invalid Credentials' })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Route to get user profile
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId).select('-password');
        if (user) {
            res.json({ success: true, user })
        } else {
            res.json({ success: false, message: "User not found" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie(COOKIE_NAME, getCookieOptions());
        return res.status(200).json({ success: true, message: "Successfully logged out" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email Required" })
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "No user with the given email exits" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset Otp',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                  <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 6px; border: 1px solid #ddd;">
                    <h2 style="color: #4CAF50;">Reset Password</h2>
                    <p>Hi ${user.name},</p>
                    <p>The otp to reset your Forever password is given below: </p>
                    <div style="font-size: 20px; font-weight: bold; color: #333; background-color: #e0f7fa; padding: 10px; border-radius: 4px; display: inline-block; margin: 15px 0;">
                      ${otp}
                    </div>
                    <p>Use this OTP to proceed further. This OTP is valid for the next <strong>10 minutes</strong>. If you didn't request this, please ignore this email.</p>
                    <p>Best regards,<br>The Forever Team</p>
                  </div>
                </div>
              `
        }

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Password reset otp sent on email' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Missing details" })
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid Otp' })
        }

        if (user.resetOtpExpiry < Date.now()) {
            return res.json({ success: false, message: 'Otp Already Expired' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpiry = 0;

        await user.save();

        return res.json({ success: true, message: 'Password reset successfully' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}


export { loginUser, registerUser, logoutUser, adminLogin, getUserProfile, sendResetOtp, resetPassword };
