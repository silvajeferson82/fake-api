const express = require("express");
const router = express.Router();
const {v4:uuidv4} = require("uuid");
const format = require("date-fns/format")

/**
 * @swagger
 * components:
 *   schemas:
 *     Debitos:
 *        type: object
 *        required:
 *          - usuario_nome
 *          - usuario_documento
 *          - usuario_email
 *          - usuario_telefone
 *          - usuario_data_nascimento
 *          - cobranca_descricao
 *          - cobranca_valor
 *          - cobranca_boleto_aceite
 *          - cobranca_boleto_parcela
 *          - pc_juros
 *          - vencimento
 *          - cobranca_numero_cliente_credor
 *          - pc_tempo_negociacao
 *          - pc_desconto
 *          - endereco_rua:
 *          - endereco_numero
 *          - endereco_complemento
 *          - endereco_bairro
 *          - endereco_cidade
 *          - endereco_estado
 *          - endereco_cep
 *        properties:
 *          debito_id:
 *             type: string
 *             description: Gerado automaticamente
 *          usuario_nome:
 *             type: string
 *             example: 'teste 45'	
 *          usuario_documento:
 *             type: string
 *             example: '4545454545454545'
 *          usuario_data_nascimento:
 *             type: string
 *             example: 'YYYY-MM-DD'
 *          usuario_email:
 *             type: string
 *             example: 'email@email.com'
 *          usuario_telefone:
 *             type: string
 *             example: '00-00000-0000'
 *          cobranca_descricao:
 *             type: string
 *             example: 'Sobre a cobrança'
 *          cobranca_valor:
 *             type: number
 *             example: '900.50'
 *          pc_juros:
 *             type: number
 *             example: '2.5'
 *          pc_multa:
 *             type: number
 *             example: '1.5'
 *          pc_tempo_negociacao:
 *             type: number
 *             example: '2.0'
 *          pc_desconto:
 *             type: number
 *             example: '0.0'
 *          vencimento: 
 *             type: string
 *             example: 'YYYY-MM-DD'
 *          cobranca_numero_cliente_credor: 
 *             type: number
 *             example: '222.3'
 *          endereco_cep:
 *             type: string
 *             example: '66666-555'
 *          endereco_estado:
 *             type: string
 *             example: 'PA'
 *          endereco_complemento:
 *             type: string
 *             example: 'Proximo a praça'
 *          endereco_bairro: 
 *             type: string
 *             example: 'Cruzeiro'
 *          endereco_cidade: 
 *             type: string
 *             example: 'Ananindeua'
 *          endereco_rua:
 *             type: string
 *             example: 'Rua do Meio'
 *          endereco_numero:
 *             type: string
 *             example: '25'
 *          created_at:
 *             type: string
 *             description: Gerado automaticamente
 *        example:
 *          usuario_nome: Teste usuario
 *          usuario_documento: '4545454545454545'
 *          usuario_data_nascimento: YYYY-MM-DD
 *          usuario_email: 'email@email.com'
 *          usuario_telefone: 00-00000-0000
 *          cobranca_descricao: Sobre a cobrança
 *          cobranca_valor: 900.50
 *          pc_juros: 2.5
 *          pc_multa: 1.5
 *          pc_tempo_negociacao: 2.0
 *          pc_desconto: 0.0
 *          vencimento: YYYY-MM-DD
 *          cobranca_numero_cliente_credor: 222.3
 *          endereco_cep: 66666-555
 *          endereco_estado: PA
 *          endereco_complemento: prox. a praça
 *          endereco_bairro: Cruzeiro
 *          endereco_cidade: Ananindeua
 *          endereco_rua: Do meio
 *          endereco_numero: 25
 */

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
 *    tags: [Debitos]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Debitos'
 */

router.get("/listar", (req, res) => {
	const debito = req.app.db.get("debitos");

	res.send(debito);
});

//Busca Debito por ID
/**
 * @swagger
 * /debitos/listar/{debito_id}:
 *   get:
 *     tags: [Debitos]
 *     parameters:
 *       - in: path
 *         name: debito_id
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
 *                $ref: '#/components/schemas/Debitos'
 *       404:
 *         description: Débito não encontrado
 */

router.get("/listar/:debito_id", (req, res) => {
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Debitos'
 *     responses:
 *       200:
 *         description: Registro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Debitos'
 *       500:
 *         description: Erro ao criar registro
 */

router.post("/registrar", (req, res) => {
	//const dateNow = new Date()
	const dateNow = format(new Date(),"yyyy-MM-dd");
	try {
		const debito = {
			debito_id: uuidv4(),
			...req.body,
			created_at: dateNow
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
 * /debitos/alterar/{debito_id}:
 *  put:
 *    tags: [Debitos]
 *    parameters:
 *      - in: path
 *        name: debito_id
 *        schema:
 *          type: string
 *        required: true
 *    requestBody:
 *      requered: true
 *      content:
 *        application/json:
 *          schema:
 *             $ref: '#/components/schemas/Debitos'
 *    responses:
 *      200:
 *        description: Registro alterado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Debitos'
 *      404:
 *        description: Registro não encontrado
 *      500:
 *        description: Erro
 */

router.put("/alterar/:debito_id", (req, res) => {
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
 * /debitos/deletar/{debito_id}:
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
 *         description: Registro deletado
 *       404:
 *         description: Registro não encontrado
 */

router.delete("/deletar/:debito_id", (req, res) => {
	req.app.db.get("debitos").remove({ debito_id: req.params.debito_id }).write();

	res.sendStatus(200);
});

/**
 * @swagger
 * /debitos/periodo/{inicial}/{final}:
 *   get:
 *    tags: [Debitos]
 *    parameters:
 *      - in: path
 *        name: inicial
 *        schema: 
 *          type: string
 *        required: true
 *        description: 'Exemplo: YYYY-MM-DD'
 *      - in: path
 *        name: final
 *        schema: 
 *          type: string
 *        required: true
 *        description: 'Exemplo: YYYY-MM-DD'
 *    responses:
 *      200:
 *        descripition: Período de registros encontrado
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Debitos'
 *      404:
 *        descripition: Período de registros não encontrado
 */

router.get("/periodo/:inicial/:final", (req, res) => {
	const { inicial, final} = req.params;

	const deadline = debito => debito.created_at >= inicial && debito.created_at <= final;

	const debitos = req.app.db.get("debitos").value();
	const debitos_filtrados = debitos.filter(deadline);


	if(debitos_filtrados == 0){
		return res.status(404).json({message: "Nao foi encontrado nenhum registro nesse período."})
	}

	return res.json(debitos_filtrados)
});

module.exports = router;
