const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const router = express.Router()

const Users = require('../model/user')
const { redirect } = require('express/lib/response')

//Inicio de Secion 
router.post("/", async function (req, res) {
    const { email, password } = req.body
    let resultado = false
    const usuarioObj = await Users.findOne({ where: { email: email } })

    if (usuarioObj !== null) {
        resultado = await bcrypt.compare(password, usuarioObj.password)
    }

    if (resultado) {
        payload = {
            id: usuarioObj.id,
            password: usuarioObj.password,
            email: usuarioObj.email
        }

        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '10h' })
        res.cookie("token", token)
        res.redirect("/archivos")
    }
    else {
        res.send(`
        <h1>No se pudo iniciar sesion</h1>
        <button onclick="window.location.href='/'">Volver</button>
    `)
    }

})

module.exports = {
    router: router
}