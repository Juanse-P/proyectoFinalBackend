import orderModel from '../models/orderModel.js';
import prodModel from '../models/prodModel.js';

export const verifyStock = async (req, res, next) => {
  for (const el of req.body) {
    const searchProd = await prodModel.findById(el.prodId);
    if (searchProd.stock >= el.quantity) {
      return next();
    }
    return res
      .status(400)
      .json({ error: 'No se puede crear la orden debido a que no hay stock' });
  }
};

export const orderExists = async (req, res, next) => {
  const searchOrder = await orderModel.findOne({orderNumber: req.params.orderNumber})
  if(searchOrder) return next()
  res.status(404).json({error: 'Orden no encontrada'})
}