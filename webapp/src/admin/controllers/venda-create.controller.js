(function(){
'use strict';
angular
  .module('VendaCreateControllers',[])
  .config(config)
  .controller('VendaCreateController', VendaCreateController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.admin-create-venda',{
        url : '/venda/create',
        templateUrl: 'src/admin/controllers/venda-create.html',
        controller : 'VendaCreateController',
        controllerAs : 'vm',
        resolve : {
          produtoPreService : produtoPreService,
          clientePreService : clientePreService,
          produtoAVencerPreService : produtoAVencerPreService,
          produtoEstoqueBaixoPreService: produtoEstoqueBaixoPreService
        }
      });

       produtoEstoqueBaixoPreService.$inject = ['Service'];
      function produtoEstoqueBaixoPreService(Service){
            return Service.listProdutoEstoqueBaixo();
      }

      produtoAVencerPreService.$inject = ['Service'];
      function produtoAVencerPreService(Service){
            return Service.listProdutosAVencer();
      }

      produtoPreService.$inject = ['Service'];
      function produtoPreService(Service){
            return Service.listProdutoVenda();
      }

       clientePreService.$inject = ['Service'];
      function clientePreService(Service){
            return Service.listClienteVenda();
      }
  };
  var vmTmp;
  VendaCreateController.$inject = ['$location', '$rootScope', '$state', '$scope', 'Service', 'produtoPreService', 'clientePreService', 'produtoAVencerPreService', 'produtoEstoqueBaixoPreService'];
  function VendaCreateController($location, $rootScope, $state, $scope, Service, produtoPreService, clientePreService, produtoAVencerPreService, produtoEstoqueBaixoPreService){
    if("undefined" === typeof $rootScope.userLogado){
      $location.path('/');//redireciona para login
   
    } else {
      var isOK = Service.verificaPermissao($rootScope.userLogado, 'roleVendaCad');
     if(!isOK){
        $location.path('/');//redireciona para login
     }
    }

    var vm = this;
    $scope.valorDeVenda = produtoPreService.data.valorDeVenda;
    $scope.quantidadeEstoque =  produtoPreService.data.quantidadeEstoque;
    $rootScope.messageWarning = '';
    $rootScope.messageSuccess = '';
    vm.save = save;
    vm.listProdutoVenda = produtoPreService.data;
    vm.listClienteVenda = clientePreService.data;
    vm.setQuantidadeVendaMais = setQuantidadeVendaMais;
    vm.setQuantidadeVendaMenos = setQuantidadeVendaMenos;
    vm.setValorTotalVenda = setValorTotalVenda;
    vm.setValorUnitario = setValorUnitario;
    var venda = {quantidadeVenda:1, 
                 valorUnitario:'',
                 valorTotalVenda:0,
                 valorPagoCliente:0,
                 aReceber: 0
               };
    vm.venda = venda;
    vm.onlyMoney = onlyMoney;
    vm.limpaValorUnitario = limpaValorUnitario;
    vm.valorAReceber = valorAReceber;
    $rootScope.produtoAVencer = produtoAVencerPreService.data;
    $rootScope.produtoEstoqueBaixo = produtoEstoqueBaixoPreService;
    $rootScope.produtoAVencerSize = produtoAVencerPreService.data.length;
    $rootScope.produtoEstoqueBaixoSize = produtoEstoqueBaixoPreService.length;
    $rootScope.totalAvisoSize = produtoAVencerPreService.data.length + produtoEstoqueBaixoPreService.length;
    vmTmp = vm;

    function valorAReceber(e){
      var keyCode = (e.which) ? e.which : e.keyCode;
      var vlrPago = 0;
      vlrPago = String.fromCharCode(keyCode);

      venda.aReceber = (venda.valorTotalVenda - venda.valorPagoCliente); 
    }

    function setValorUnitario(valor){
      venda.valorUnitario = valor;
    }

    function limpaValorUnitario(){
      venda.valorUnitario = '';
      setValorTotalVenda(venda.quantidadeVenda, venda.valorUnitario);
    }

    function setValorTotalVenda(quantidadeVenda, valorUnitario){
      venda.valorTotalVenda = (quantidadeVenda*valorUnitario);
    }


    function setQuantidadeVendaMais(quantidadeVenda){
      if(quantidadeVenda >= 0){
         venda.quantidadeVenda =  (quantidadeVenda+1);
         setValorTotalVenda(venda.quantidadeVenda, venda.valorUnitario);
      }

    }

     function setQuantidadeVendaMenos(quantidadeVenda){
      if(quantidadeVenda > 1){
         venda.quantidadeVenda = (quantidadeVenda-1);
         setValorTotalVenda(venda.quantidadeVenda, venda.valorUnitario);
      }
    }

    function save(){
      Pace.restart();
      if ($scope.formVendaCreate.$valid) {
            Service
              .vendaCreate(vm.venda)
              .then(VendaCreateSuccess);
      }else{
            if(!$scope.formVendaCreate.produto.$valid)
              $scope.formVendaCreate.produto.$pristine = false;

            if(!$scope.formVendaCreate.quantidadeVenda.$valid)
              $scope.formVendaCreate.quantidadeVenda.$pristine = false;

            if(!$scope.formVendaCreate.valorUnitario.$valid)
              $scope.formVendaCreate.valorUnitario.$pristine = false;

              $rootScope.messageSuccess = '';
              $rootScope.messageWarning = 'Por favor, informe os campos obrigatórios'; 
          }
    }

    function VendaCreateSuccess(response){
     // console.log(response);
      $rootScope.messageSuccess = response.data.message;
      $rootScope.messageWarning = '';
      var venda = {quantidadeVenda:1, 
                 valorUnitario:'',
                 valorTotalVenda:0,
                 valorPagoCliente:0,
                 aReceber: 0
               };
      vm.venda = venda;
      //$state.reload();
    }

    $scope.updateDataProduto = function(produtoSelecionado) {
          console.log(vmTmp);
          var produtoNew = {};
          angular.forEach(vmTmp.listProdutoVenda, function(produto, index) {
              if(angular.equals(produto._id, produtoSelecionado._id))
              this.produtoNew = produto;
          },produtoNew); 

          //var produto =Service.getProdutoById(id);
          $scope.valorDeVenda = produtoNew.produtoNew.valorDeVenda;   
          venda.valorUnitario =   $scope.valorDeVenda ;     
          $scope.quantidadeEstoque =  produtoNew.produtoNew.quantidadeEstoque;
          setValorTotalVenda(venda.quantidadeVenda, venda.valorUnitario);
        } 

    //valor monetario
    function onlyMoney(e, myValue) {
      var keyCode = (e.which) ? e.which : e.keyCode;
      if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
          e.preventDefault();
      }else{
        venda.valorUnitario += String.fromCharCode(keyCode);  
        setValorTotalVenda(venda.quantidadeVenda, venda.valorUnitario);
        e.preventDefault();
      }
       // console.log(keyCode);
    }


  }
}());