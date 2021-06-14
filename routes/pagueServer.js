const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;


//Lista Todos as negociações
 /**
  * @swagger
  * tags:
  *   name: Negotiation
  *   description: Routes Nogociation
  */

/**
 * @swagger
 * /negotiation:
 *   get:
 *     tags: [Negotiations]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Negotiation'
 */

router.get("/", (req, res) => {
	const debito = req.app.db.get("negotiation");

	res.send(debito);
});

//Busca Negociação por ID
/**
 * @swagger
 * /negotiation/{id}:
 *   get:
 *     summary: Get the Cliente by id
 *     tags: [Negotiations]
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
 *               $ref: '#/components/schemas/Negotiation'
 *       404:
 *         description: The client was not found
 */

router.get("/:id", (req, res) => {
  const debito = req.app.db.get("negotiation").find({ id: req.params.id }).value();

  if(!debito){
    res.sendStatus(404)
  }

	res.send(debito);
});


//Cria novo Clientes
/**
 * @swagger
 * /negotiation:
 *   post:
 *     summary: Create a new client
 *     tags: [Negotiations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Negotiation'
 *     responses:
 *       200:
 *         description: The client was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Negociation'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
	try {
		const debito = {
			id: nanoid(idLength),
			...req.body,
		};

    req.app.db.get("negotiation").push(debito).write();
    
    res.send(debito)
	} catch (error) {
		return res.status(500).send(error);
	}
});

//Atualizar cliente por ID
/**
 * @swagger
 * /negotiation/{id}:
 *  put:
 *    summary: Update the client by the id
 *    tags: [Negotiations]
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
 *            $ref: '#/components/schemas/Negotiation'
 *    responses:
 *      200:
 *        description: The client was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Negotiation'
 *      404:
 *        description: The client was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res) => {
	try {
		req.app.db
			.get("negotiation")
			.find({ id: req.params.id })
			.assign(req.body)
			.write();

		res.send(req.app.db.get("negotiation").find({ id: req.params.id }));
	} catch (error) {
		return res.status(500).send(error);
	}
});

//Remover cliente por ID
/**
 * @swagger
 * /negotiation/{id}:
 *   delete:
 *     summary: Remove the client by id
 *     tags: [Negotiations]
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
	req.app.db.get("negotiation").remove({ id: req.params.id }).write();

	res.sendStatus(200);
});

module.exports = router;
