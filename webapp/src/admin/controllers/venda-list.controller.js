(function(){
'use strict';
angular
  .module('VendaListControllers',[])
  .config(config)
  .controller('VendaListController', VendaListController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.venda-list',{
        url : '/venda/list',
        templateUrl: 'src/admin/controllers/venda-list.html',
        controller : 'VendaListController',
        controllerAs : 'vm',
        resolve : {
        	vendaPreService : vendaPreService 
        }
      });

      vendaPreService.$inject = ['Service'];
      function vendaPreService(Service){
           	return Service.getAllVendas();
      }
  };

  VendaListController.$inject = ['$location', '$rootScope','$state','Service', 'vendaPreService'];
  function VendaListController($location, $rootScope ,$state, Service, vendaPreService){
    if("undefined" === typeof $rootScope.userLogado){
      $location.path('/');//redireciona para login
   
    } else {
      var isOK = Service.verificaPermissao($rootScope.userLogado, 'roleVendaCad');
     if(!isOK){
        $location.path('/');//redireciona para login
     }
    }
    $rootScope.messageWarning = '';
    $rootScope.messageSuccess = $rootScope.messageSuccess.indexOf('Venda')>=0?$rootScope.messageSuccess:'';
    
    var vm = this;
    vm.editar = editar;
    vm.vendas = vendaPreService.data;  

    function editar(id) {
        Pace.restart();
        $state.go('app.venda-editar', {id : id})
    }
       
  }
}());