const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;


//Lista Todos os Clientes
/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the Cliente
 *         name:
 *           type: string
 *           description: Nome do cliente
 *         email:
 *           type: string
 *           description: Email do cliente
 *       example:
 *         id: d5fE_asz
 *         name: Nome Sobrenome
 *         email: "nome@email.com"
 */

 /**
  * @swagger
  * tags:
  *   name: Clientes
  *   description: The Customer and Payment Management API
  */

/**
 * @swagger
 * /server:
 *   get:
 *     summary: Returns the list of all the client`s
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: The list of the client's
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */

router.get("/", (req, res) => {
	const cliente = req.app.db.get("cliente");

	res.send(cliente);
});

//Busca cliente por ID
/**
 * @swagger
 * /server/{id}:
 *   get:
 *     summary: Get the Cliente by id
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client id
 *     responses:
 *       200:
 *         description: The client description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: The client was not found
 */

router.get("/:id", (req, res) => {
  const cliente = req.app.db.get("cliente").find({ id: req.params.id }).value();

  if(!cliente){
    res.sendStatus(404)
  }

	res.send(cliente);
});


//Cria novo Clientes
/**
 * @swagger
 * /server:
 *   post:
 *     summary: Create a new client
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: The client was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
	try {
		const cliente = {
			id: nanoid(idLength),
			...req.body,
		};

    req.app.db.get("cliente").push(cliente).write();
    
    res.send(cliente)
	} catch (error) {
		return res.status(500).send(error);
	}
});

//Atualizar cliente por ID
/**
 * @swagger
 * /server/{id}:
 *  put:
 *    summary: Update the client by the id
 *    tags: [Clientes]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The client id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Cliente'
 *    responses:
 *      200:
 *        description: The client was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Cliente'
 *      404:
 *        description: The client was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res) => {
	try {
		req.app.db
			.get("cliente")
			.find({ id: req.params.id })
			.assign(req.body)
			.write();

		res.send(req.app.db.get("cliente").find({ id: req.params.id }));
	} catch (error) {
		return res.status(500).send(error);
	}
});

//Remover cliente por ID
/**
 * @swagger
 * /server/{id}:
 *   delete:
 *     summary: Remove the client by id
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client id
 * 
 *     responses:
 *       200:
 *         description: The client was deleted
 *       404:
 *         description: The client was not found
 */

router.delete("/:id", (req, res) => {
	req.app.db.get("cliente").remove({ id: req.params.id }).write();

	res.sendStatus(200);
});

module.exports = router;
