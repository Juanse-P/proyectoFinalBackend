import CartApi from '../api/cart/cartApi.js';
import { validateProductCart } from '../utilities/helpers.js';

const api = new CartApi()

export const getAll = async (req, res) => {
  try {
    const products = await api.getAll(req.user.email)
    res.json({success: true, products})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

export const addToCart = async (req, res) => {
  try {
    const validate = await validateProductCart(req.body.items, req.user.email)
    if(validate) return res.status(400).json({error: 'Este producto ya se encuentra en el carrito'})
    const adding = await api.addToCart(req.body, req.user.email)
    res.json({success: true, message: "succes " + adding})
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}

export const updateOne = async (req, res) => {
  try {
    const product = await api.updateOne(req.user.email, req.params.prodId, req.body.quantity)
    res.json({success: true, product})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

export const deleteOne = async (req, res) => {
  try {
    await api.deleteOne(req.params.prodId, req.user.email)
    res.json({success:true})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

export const deleteAll = async (req, res) => {
  try {
    await api.deleteAll(req.user.email)
    res.json({success: true})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}