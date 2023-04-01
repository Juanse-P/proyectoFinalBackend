import Prods from '../models/prodModel.js'


export const isEmpty = async (req, res, next) => {
  const prods = await Prods.find({})
  if(prods.length > 0) return next()
  return res.status(404).json({error: 'El producto esta vacio'})
}

export const prodAlreadyExists = async (req,res, next) => {
  const {title} = req.body
  const product = await Prods.findOne({title})
  if(!product) return next()
  res.status(400).json({error: 'El producto ya existe'})
}

export const getByIdVerify = async (req, res, next) => {
  await Prods.findOne({_id: req.params.id})
    .then(prod => {
      if (prod) return next();
      res.status(404).json({ error: 'Producto no encontrado' });
    })
    .catch(error => {
      res.status(406).json({error: error.message})
    })
}

export const getByCategoryVerify = async (req, res, next) => {
  await Prods.find({category: req.params.category})
    .then(prod => {
      if(prod.length > 0) return next()
      res.status(404).json({error: 'Producto en categoria no encontrado'})
    })
    .catch(err => {
      res.status(500).json({error: err.message})
    })
}
