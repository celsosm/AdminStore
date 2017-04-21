(function(){
'use strict';
angular
  .module('VendaEditControllers',[])
  .config(config)
  .controller('VendaEditController', VendaEditController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.venda-editar',{
        url : '/venda/edit/:id',
        templateUrl: 'src/admin/controllers/venda-edit.html',
        controller : 'VendaEditController',
        controllerAs : 'vm',
        resolve : {
          produtoPreService : produtoPreService,
          clientePreService : clientePreService,
          vendaPreService : vendaPreService 
        }
      });

      vendaPreService.$inject = ['Service', '$stateParams'];
      function vendaPreService(Service, $stateParams){
      	var id = $stateParams.id;
      	return Service.getVendaById(id);
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
  VendaEditController.$inject = ['$location', '$rootScope','$state', '$scope', 'Service', 'vendaPreService', 'produtoPreService', 'clientePreService'];
  function VendaEditController($location, $rootScope,$state, $scope, Service, vendaPreService, produtoPreService, clientePreService){
    if("undefined" === typeof $rootScope.userLogado){
      $location.path('/');//redireciona para login
   
    } else {
      var isOK = Service.verificaPermissao($rootScope.userLogado, 'roleVendaCad');
     if(!isOK){
        $location.path('/');//redireciona para login
     }
    }
    $rootScope.messageWarning = '';
    $rootScope.messageSuccess = '';
    var vm = this;
    vm.venda = vendaPreService.data;
    vm.listProdutoVenda = produtoPreService.data;
    vm.listClienteVenda = clientePreService.data;
    vm.save = save;
    var venda = {quantidadeVenda:1, 
                 valorUnitario:'',
                 valorTotalVenda:0,
                 valorPagoCliente:0,
                 aReceber: 0
               };
    vmTmp = vm;
    Pace.restart();
    $scope.valorDeVenda = vm.venda.produto.valorDeVenda;   
    $scope.quantidadeEstoque = vm.venda.produto.quantidadeEstoque;
    vm.valorAReceber = valorAReceber;

    function valorAReceber(e){
      var keyCode = (e.which) ? e.which : e.keyCode;
      var vlrPago = 0;
      vlrPago = String.fromCharCode(keyCode);

      vm.venda.aReceber = (vm.venda.valorTotalVenda - vm.venda.valorPagoCliente); 
    }

    function save(){
      Pace.restart();
          Service
            .editVenda(vm.venda)
            .then(VendaEditSuccess);
    }

    function VendaEditSuccess(response){
      $rootScope.messageWarning = '';
      $rootScope.messageSuccess = response.data.message;
      $state.go('app.venda-list');
    }
  }
}());