import OrderApi from '../api/orders/orderApi.js';
import prodModel from '../models/prodModel.js';
import { transporter } from '../utilities/nodemailer.js';
import { nanoid } from 'nanoid';
import { emailData, findAdmin } from '../utilities/helpers.js';

const order = new OrderApi();

export const createOrder = async (req, res) => {
  try {
    let prods = []

    for(const item of req.body){
      await prodModel.findById(item.prodId)
        .then(resp => {
          if(resp){
            const data = {
              title: resp.title,
              price: resp.price,
              quantity: item.quantity
            }
            prods.push(data)
          }
        })
        await prodModel.updateOne({_id: item.prodId}, {$inc: {stock: -item.quantity}})
      }
      let total = await prods.reduce((acc, el) => (acc += el.price * el.quantity), 0)

      const createOrder = await order.createOrder({
        products: prods,
        email: req.user.email,
        date: new Date(),
        orderNumber: nanoid(),
        totalPrice: total
      })
    await transporter.sendMail({
      from: 'node app',
      to: await findAdmin(),
      subject: 'Nueva orden generada',
      html: ` <h1>${req.user.email} Ha hecho una nueva compra:</h1> <h2>Numero de oreden: ${createOrder.orderNumber} </h2> <strong> Precio total: $${createOrder.totalPrice}</strong>`,
    });
    res.status(200).json({
      success: true,
      order: createOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await order.getOrders();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOneOrder = async (req, res) => {
  try {
    const oneOrder = await order.getOneOrder(req.paramas.orderNumber);
    res.status(200).json({ success: true, order: oneOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    await order.deleteOrder(req.params.orderNumber);
    res.json({ success: true, orderDeleted: req.params.orderNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
