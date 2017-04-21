var bodyParser = require('body-parser')
	,	http 	   	 = require('http') 
	,	express    = require('express')
	,	app 	     = express()
	,	database 	   = require('./Schema.js');	

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', function (req, res){
	res.sendFile(__dirname + '/webapp/index.html');
})

app.post('/app/produto/cadastrar', function (req, res) {
	var newProduto = new database.produto({
					                      nomeProduto: req.body.nomeProduto,
					                      valorDeVenda: req.body.valorDeVenda,
					                      valorDeCompra: req.body.valorDeCompra,
					                      dataValidate: req.body.dataValidate,
					                      quantidadeEstoque: req.body.quantidadeEstoque,
					                      quantidadeMinimaEstoque: req.body.quantidadeMinimaEstoque,
					                      fornecedor: req.body.fornecedor 
				                    	});

	newProduto.save(function(err) {
		if (err) throw err;
		
	});
	 
	res.json({ message: 'Produto cadastrado com sucesso!', data: req.body.nome});
})



app.post('/app/cliente/cadastrar', function (req, res) {
	var newCliente= new database.cliente({
					                      nomeCliente: req.body.nomeCliente,
                      					  contato: req.body.contato,
                      					  ativo: req.body.ativo
				                    	});

	newCliente.save(function(err) {
		if (err) throw err;
		
	});
	 
	res.json({ message: 'Cliente cadastrado com sucesso!'});
})

app.post('/app/compra/cadastrar', function (req, res) {
	var newCompra= new database.compra({
										  nomeLoja: req.body.nomeLoja,
					                      valorTotalCompra: req.body.valorTotalCompra,
					                      dataCompra: req.body.dataCompra,
                      					  observacao: req.body.observacao,
                      					  ativo: req.body.ativo
				                    	});

	newCompra.save(function(err) {
		if (err) throw err;
		
	});
	 
	res.json({ message: 'Compra cadastrado com sucesso!'});
})

app.post('/app/user/findUser', function (req, res) {
	var users = [
				  {
			 		nomeUser:'Creuza - CEO',
			 		cargo:'Fundadora da Startup',
			 		avatar: 'avatar3.png',
			 		login:'admin',
				 	senha:'sucesso2017',
					perfil: 'adm',
					showLayout: true,
					roleProdutoLst:true,
					roleProdutoCad:true,
					roleCompraLst:true,
					roleCompraCad:true,
					roleClienteLst:true,
					roleClienteCad:true,
					roleVendaCad: true,
					roleVendaLst: true
				  },
				  {
			 		nomeUser:'Vendedor',
			 		cargo:'Vendedor Comercial',
			 		avatar: 'avatar5.png',
			 		login:'loja',
				 	senha:'loja',
					perfil: 'vd',
					showLayout: true,
					roleProdutoLst:false,
					roleProdutoCad: false,
					roleCompra:false,
					roleClienteLst:false,
					roleClienteCad:false,
					roleVendaCad: true,
					roleVendaLst: false
				  }
				];

    res.json(users);
	
})

app.post('/app/venda/cadastrar', function (req, res) {
	var newVenda= new database.venda({
					                      produto: req.body.produto,
					                      cliente: req.body.cliente,
					                      tipoVenda: req.body.tipoVenda,
					                      dataVenda: req.body.dataVenda,
					                      quantidadeVenda: req.body.quantidadeVenda,
					                      valorTotalVenda: req.body.valorTotalVenda,
					                      observacoes:req.body.observacoes ,
					                      valorPagoCliente: req.body.valorPagoCliente,
					                      aReceber: req.body.aReceber,
					                      valorUnitario: req.body.valorUnitario
					                    });

	newVenda.save(function(err) {
		if (err) throw err;
		
	});
	 
	res.json({ message: 'Venda registrada com sucesso!'});
})

app.get('/app/listarById/:id', function (req, res) {
	database.produto.findOne({ _id: req.params.id }, function(err, todos) {
		if (err) throw err;
		console.log(todos);
		res.json(todos);
	});
})



app.get('/app/cliente/edit/:id', function (req, res) {
	database.cliente.findOne({ _id: req.params.id }, function(err, todos) {
		if (err) throw err;
		res.json(todos);
	});
})

app.get('/app/venda/edit/:id', function (req, res) {
	database.venda.findOne({ _id: req.params.id })
	.populate('produto')
    .populate('cliente')
    .exec(function(err, todos){
     	//console.log(todos);
          res.json(todos);
     })
})

app.get('/app/compra/edit/:id', function (req, res) {
	database.compra.findOne({ _id: req.params.id }, function(err, todos) {
		if (err) throw err;
		res.json(todos);
	});
})

app.get('/app/listar', function (req, res) {
	//console.log(database);
	database.produto.find(function(err, todos) {
		if (err) throw err;
		//console.log(todos);
		res.json(todos);
	});
})



app.get('/app/produto/listProdutosAVencer', function (req, res) {
	var x = 1; //or whatever offset
	var currentDate = new Date();
	currentDate.setMonth((currentDate.getMonth()+1));
	//res.json(currentDate);
	/*database.produto.find({ '$where': 'dataValidate'<currentDate }, function(err, todos) {
		if (err) throw err;
		res.json(todos);
	});*/

	database.produto.find({ dataValidate: {$lt: currentDate} }, function(err, todos) {
		if (err) throw err;
		res.json(todos);
	});
})


app.get('/app/produto/listProdutoEstoqueBaixo', function (req, res) {
	database.produto.find( {$where: 'this.quantidadeMinimaEstoque <= this.quantidadeEstoque'}
		, function(err, todos) {
		if (err) throw err;
		res.json(todos);
	});
})


app.get('/app/compra/listar', function (req, res) {
	//console.log(database);
	database.compra.find(function(err, todos) {
		if (err) throw err;
		//console.log(todos);
		res.json(todos);
	});
})

app.get('/app/venda/listar', function (req, res) {

	database.venda.find()
     .populate('produto')
     .populate('cliente')
     .exec(function(err, todos){
     	//console.log(todos);
          res.json(todos);
     })

	/*database.venda.find(function(err, todos) {
		if (err) throw err;
		res.json(todos);
	});*/
})

app.get('/app/cliente/listar', function (req, res) {
	database.cliente.find(function(err, todos) {
		if (err) throw err;
		res.json(todos);
	});
})

app.delete('/app/delete/:id', function (req, res) {
	database.produto.findByIdAndUpdate(req.params.id, {
					                      ativo: 'Não'
				                    	}, function(err, user) {
		if (err) res.send(err);
		res.json({ message: 'Produto inativado com sucesso!'});
	});

})

app.delete('/app/compra/delete/:id', function (req, res) {
	database.compra.findByIdAndUpdate(req.params.id, {
					                      ativo: 'Não'
				                    	}, function(err, user) {
		if (err) res.send(err);
		res.json({ message: 'Compra inativado com sucesso!'});
	});

})

app.delete('/app/venda/delete/:id', function (req, res) {
	database.venda.findOneAndRemove({ _id: req.params.id }, function(err) {
		if (err) throw err;
	});
	res.json({ message: 'Venda excluida'});
})

app.delete('/app/cliente/delete/:id', function (req, res) {
	database.cliente.findByIdAndUpdate(req.params.id, {
					                      ativo: 'Não'
				                    	}, function(err, user) {
		if (err) res.send(err);
		res.json({ message: 'Cliente inativado com sucesso!'});
	});
})


app.put("/app/produto/editar", function(req, res){
	database.produto.findByIdAndUpdate(req.body._id, {
					                      nomeProduto: req.body.nomeProduto,
					                      valorDeVenda: req.body.valorDeVenda,
					                      valorDeCompra: req.body.valorDeCompra,
					                      dataValidate: req.body.dataValidate,
					                      quantidadeEstoque: req.body.quantidadeEstoque,
					                      quantidadeMinimaEstoque: req.body.quantidadeMinimaEstoque,
					                      fornecedor: req.body.fornecedor,
					                      ativo: req.body.ativo
				                    	}, function(err, user) {
		if (err) res.send(err);
		res.json({ message: 'Produto alterado com sucesso'});
	});
});

app.put("/app/venda/editar", function(req, res){
	database.venda.findByIdAndUpdate(req.body._id, {
								                      cliente: req.body.cliente,
								                      tipoVenda: req.body.tipoVenda,
								                      observacoes:req.body.observacoes ,
								                      valorPagoCliente: req.body.valorPagoCliente,
								                      aReceber: req.body.aReceber
							                    	}, function(err, user) {
		if (err) res.send(err);
		res.json({ message: 'Venda alterada com sucesso!'});
	});
});


app.put("/app/compra/editar", function(req, res){
	database.compra.findByIdAndUpdate(req.body._id, {
								                      nomeLoja: req.body.nomeLoja,
								                      valorTotalCompra: req.body.valorTotalCompra,
								                      dataCompra: req.body.dataCompra,
								                      observacao: req.body.observacao,
								                      ativo: req.body.ativo 
							                    	}, function(err, user) {
		if (err) res.send(err);
		res.json({ message: 'Compra alterada com sucesso!'});
	});
});

app.put("/app/cliente/editar", function(req, res){
	database.cliente.findByIdAndUpdate(req.body._id, { 	nomeCliente: 
														req.body.nomeCliente,
														contato: req.body.contato,
														ativo: req.body.ativo}, 
													function(err, user) {
		if (err) res.send(err);
		res.json({ message: 'Cliente alterado com sucesso!'});
	});
});

app.get('/app/produto/listProdutoVenda', function (req, res) {
	database.produto.find({ ativo: 'Sim' }, function(err, todos) {
		if (err) throw err;
		res.json(todos);
	});

	/*var query = database.produto.find({ativo:'Sim'}).select('nomeProduto _id valorDeVenda quantidadeEstoque');
	
	query.exec(function (err, rs) {
        if (err) return next(err);
        res.send(rs);
    });	*/
})

app.get('/app/cliente/listClienteVenda', function (req, res) {
	database.cliente.find({ ativo: 'Sim' }, function(err, todos) {
		if (err) throw err;
		res.json(todos);
	});
})

app.use(express.static(__dirname + '/webapp'));

app.listen(3000)
console.log("localhost:3000")