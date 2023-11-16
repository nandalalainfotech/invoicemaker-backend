import express from "express";
import clinetModel from "../Models/clientModel.js";
import expressAsyncHandler from "express-async-handler";
import Clients from "../Models/clientModel.js";



const clientRouter = express.Router();

clientRouter.post('/ClientUser', expressAsyncHandler(async (req, res) => {

    const user = new clinetModel({
        clientName: req.body.clientName,
        clientAddress: req.body.clientAddress,
        clientEmail: req.body.clientEmail,
        clientMobileNo: req.body.clientMobileNo,
        // password: bcrypt.hashSync(req.body.password),
    });
    const createClient = await user.save();
    res.send({
        clientName: createClient.name,
        clientAddress: createClient.billingAddress,
        clientEmail: createClient.email,
        clientMobileNo: createClient.mobileNo,
    });

}))

clientRouter.get(
    '/getClientUser',
    expressAsyncHandler(async (req, res) => {

        const client = await Clients.find();
        if (client) {
            res.send(client);
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);

export default clientRouter;