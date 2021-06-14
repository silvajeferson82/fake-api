const express = require("express");
const router = express.Router();
const {v4:uuidv4} = require("uuid");
// const format = require("date-fns")


//Lista Todos os Débitos
 /**
  * @swagger
  * tags:
  *   name: Debitos
  *   description: Debitos Routes
  */

/**
 * @swagger
 * /debitos/listar:
 *   get:
 *     tags: [Debitos]
 *     responses:
 *       200:
 *         description: Listagem Registro de débitos
*         content:
*           application/json:
*             schema:
*               type: array
*/

router.get("/listar", (req, res) => {
	const debito = req.app.db.get("debitos");

	res.send(debito);
});

//Busca Debito por ID
/**
 * @swagger
 * /debitos/listar/debito_id:
 *   get:
 *     tags: [Debitos]
 *     parameters:
 *       - in: path
 *         name: debito_id
 *         example: 4343g43jg-kh3i4h343-3434
 *         schema:
 *           type: string
 *         required: true
 *         description: debito_id
 *     responses:
 *       200:
 *         description: Débito encontrado por ID
 *         contens:
 *           application/json:
 *             schema:
 *       404:
 *         description: Débito não encontrado
 */

router.get("/listar/debito_id", (req, res) => {
  const debito = req.app.db.get("debitos").find({ debito_id: req.params.debito_id }).value();

  if(!debito){
    res.sendStatus(404)
  }

	res.send(debito);
});

/**
 * @swagger
 * /debitos/registrar:
 *   post:
 *     tags: [Debitos]
 *     requestBody:
 *     parameters:
 *      - name: body
 *        in: body
 *        description: ''
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *              usuario_nome:
 *                  type: string
 *                  example: 'teste 45'	
 *              usuario_documento:
 *                  type: string
 *                  example: '4545454545454545'
 *              usuario_data_nascimento:
 *                  type: string
 *                  example: 'YYYY-MM-DD'
 *              usuario_email:
 *                  type: string
 *                  example: 'email@email.com'
 *              usuario_telefone:
 *                  type: string
 *                  example: '00-00000-0000'
 *              cobranca_descricao:
 *                  type: string
 *                  example: 'Sobre a cobrança'
 *              cobranca_valor:
 *                  type: number
 *                  example: '900.50'
 *              pc_juros:
 *                  type: number
 *                  example: '2.5'
 *              pc_multa:
 *                  type: number
 *                  example: '1.5'
 *              pc_tempo_negociacao:
 *                  type: number
 *                  example: '2.0'
 *              pc_desconto:
 *                  type: number
 *                  example: '0.0'
 *              vencimento: 
 *                  type: string
 *                  example: 'YYYY-MM-DD'
 *              cobranca_numero_cliente_credor: 
 *                  type: number
 *                  example: '222.3'
 *              endereco_cep:
 *                  type: string
 *                  example: '66666-555'
 *              endereco_estado:
 *                  type: string
 *                  example: 'PA'
 *              endereco_complemento:
 *                  type: string
 *                  example: 'Proximo a praça'
 *              endereco_bairro: 
 *                  type: string
 *                  example: 'Cruzeiro'
 *              endereco_cidade: 
 *                  type: string
 *                  example: 'Ananindeua'
 *              endereco_rua:
 *                  type: string
 *                  example: 'Rua do Meio'
 *              endereco_numero:
 *                  type: string
 *                  example: '25'
 *     responses:
 *       200:
 *         description: Registro de debito criado com sucesso
 *
 *       500:
 *         description: Some server error
 */

router.post("/registrar", (req, res) => {
	const dateNow = new Date()
	// const dateNow = format(new Date(),"yyyy-mm-dd");
	try {
		const debito = {
			debito_id: uuidv4(),
			created_at: dateNow,
			...req.body,
		};

    req.app.db.get("debitos").push(debito).write();
    
    res.send(debito)
	} catch (error) {
		return res.status(500).send(error);
	}
});

//Atualizar Debito por ID
/**
 * @swagger
 * /debitos/alterar/debito_id:
 *  put:
 *    tags: [Debitos]
 *    parameters:
 *      - name: debito_id
 *        in: body
 *        exemplo: 123-dedf-456-hhjj
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            debito_id:
 *             type: string
 *             example: jkjjkj-we3ee3e3-jhjhh
 *    responses:
 *      200:
 *        description: The client was updated
 *      404:
 *        description: Débito não encontrado
 *      500:
 *        description: Algo errado aconteceu
 */

router.put("/alterar/debito_id", (req, res) => {
	try {
		req.app.db
			.get("debitos")
			.find({ debito_id: req.params.debito_id })
			.assign(req.body)
			.write();

		res.send(req.app.db.get("debitos").find({ debito_id: req.params.debito_id }));
	} catch (error) {
		return res.status(500).send(error);
	}
});

//Remover débito por ID
/**
 * @swagger
 * /debitos/deletar/debito_id:
 *   delete:
 *     tags: [Debitos]
 *     parameters:
 *       - in: path
 *         name: debito_id
 *         schema:
 *           type: string
 *         required: true
 *         description: debito_id
 * 
 *     responses:
 *       200:
 *         description: Registro de débito deletado
 *       404:
 *         description: Debito não encontrado
 */

router.delete("/deletar/debito_id", (req, res) => {
	req.app.db.get("debitos").remove({ debito_id: req.params.debito_id }).write();

	res.sendStatus(200);
});

module.exports = router;
