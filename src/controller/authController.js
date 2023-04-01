import AuthApi from '../api/auth/authApi.js';
import { findAdmin } from '../utilities/helpers.js';
import { transporter } from '../utilities/nodemailer.js';

const api = new AuthApi()

export const signUp = async (req, res) => {
  try {
    if(req.body.password !== req.body.repeatPassword) return res.status(400).json({error: 'Las contraseñas no coinciden'})
    const data = req.body
    const sign = await api.signUp(data)
    if(sign) {
        await transporter.sendMail({
          from: 'node app', 
          to: await findAdmin(), 
          subject: 'New account created!',
          html: ` <strong>Bienvenido ${req.body.email}! </strong> <b>Gracias por registrarte en nuestra app:  ${req.body.firstName} ${req.body.lastName} </b>`, 
        });
      res.status(200).json({sign})
      return ;
    } 
      res.status(400).json({error: error.message})
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

  export const logIn = async (req, res) => {
    try {
      const log = await api.logIn(req.body)
      if(log)
      {
        res.cookie('myAccessToken', log.token, { httpOnly: true })
        res.status(200).json({success: "Ya estas autenticado! puedes visitar cualquier ruta como '/' "})
        return;
      }
      res.status(401).json({error: 'El correo electronico o la contraseña son incorrectos'})
    } catch (error) {
      return res.status(500).json({
      error: error.message,
    });
    }
  };

  export const logOut = async (req, res) => {
    try {
      res.clearCookie('myAccessToken')
      req.session.destroy((error) => {
        if(error) return res.status(400).json({error: error.message})
      })
      res.json({success: true})
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
  
  export const renderLogin = async (req, res) => {
    try {
      res.render('login')
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
      
    }
  }