import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import UserLists from '../Models/userModel.js';
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";

const userRouter = express.Router();


userRouter.post('/', expressAsyncHandler(async (req, res) => {
  const user = await UserLists.findOne({ email: req.body.email });
  console.log("user------------->", user);
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        id: user.id,
        fName: user.firstName,
        email: user.email,
        userrole:user.userRole,
        success: true,
      });
      return;
    }

  }
  res.status(401).send({ message: 'Invalid Email or Password' });

}
))

userRouter.post('/register', expressAsyncHandler(async (req, res) => {

  const user = new UserLists({
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });
  const createdUser = await user.save();
  res.send({
    id: createdUser.id,
    fName: createdUser.firstName,
    lName: createdUser.lastName,
    email: createdUser.email,
    password: createdUser.password,

  });

}))

userRouter.post('/checkemail', expressAsyncHandler(async (req, res) => {


  const email = req.body.email;


  const user = await UserLists.findOne({ email: email });


  if (user) {
    bcrypt.compare(email, user.email, async function (err, isMatch) {
      let otpCode = Math.floor(100000 + Math.random() * 900000);
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: "gmail",
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      var mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Password Change OTP",
        html: `<div><h1></h1><h2>Email: ${email}</h2><h2>OTP: ${otpCode}</h2></div>`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        console.log("mailOptions", mailOptions);
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      })
      res.send({ message: "Otp Sent Success", sentotp: otpCode, email });
    })
  } else {
    res.status(404).send({ message: 'Email not found' });
  }
}
))

userRouter.put(
  '/profile',
  expressAsyncHandler(async (req, res) => {

    const user = await UserLists.findOne({ email: req.body.login.login.email });


    if (user) {
      user.password = bcrypt.hashSync(req.body.password, 8);

      const updatedUser = await user.save();
      // res.send({        
      //   message:" Password changed successfully ",  
      // });
    }
  })
);

userRouter.get(
  '/getUsers',
  expressAsyncHandler(async (req, res) => {

    const user = await UserLists.find();
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);


export default userRouter;