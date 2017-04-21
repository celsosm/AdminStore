var mongoose = require('mongoose');  
//require('mongoose-double')(mongoose);
//mongoose.connect('mongodb://localhost/Escola');
mongoose.connect('mongodb://127.0.0.1:27017/Loja');

var db = mongoose.connection;  
db.on('error', function(err){  
	console.log('Mongodb - Erro de conexao.', err)
});

db.on('open', function () {  
	console.log('Mongodb - Conexão aberta.')
});

db.on('connected', function(err){  
	console.log('Mongodb - Conectado')
});

db.on('disconnected', function(err){  
	console.log('Mongodb - Desconectado')
});

var Schema = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;

var produtoShema = new Schema({
	nomeProduto: String,
	valorDeVenda: Number,
    valorDeCompra: Number,
    dataValidate: Date,
	quantidadeEstoque: { type: Number, min: 1},
	quantidadeMinimaEstoque: { type: Number, min: 1},
	fornecedor: String,
	dataAlterado: { type: Date, default: Date.now},
	ativo: { type: String, default: 'Sim' }
});

var clienteShema = new Schema({
	nomeCliente: String,
	contato: String,
	ativo: { type: String, default: 'Sim' }
});

var vendaShema = new Schema({
		                      produto: {type: mongoose.Schema.Types.ObjectId, ref: 'produtos'},
		                      cliente: {type: mongoose.Schema.Types.ObjectId, ref: 'clientes'},
		                      tipoVenda: String,
		                      dataVenda: { type: Date, default: Date.now},
		                      quantidadeVenda: { type: Number, min: 1},
		                      valorTotalVenda: { type: Number, min: 1},
		                      valorUnitario : { type: Number, min: 1},
		                      observacoes:String,
		                      ativo: { type: String, default: 'Sim' },
		                      valorPagoCliente: Number,
		                      aReceber: Number
		                    });

var comprasShema = new Schema({
                      nomeLoja: String,
                      valorTotalCompra: { type: Number, min: 1},
                      dataCompra: { type: Date, default: Date.now},
					  observacao: String,
					  ativo: { type: String, default: 'Sim' }
                    });


var produto = mongoose.model('produtos', produtoShema);
var cliente = mongoose.model('clientes', clienteShema);
var venda = mongoose.model('vendas', vendaShema);
var compra = mongoose.model('compras', comprasShema);

module.exports={
       produto:produto,
       cliente:cliente,
       venda:venda,
       compra:compra
   };