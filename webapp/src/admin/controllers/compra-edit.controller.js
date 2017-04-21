(function(){
'use strict';
angular
  .module('CompraEditControllers',[])
  .config(config)
  .controller('CompraEditController', CompraEditController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.compra-editar',{
        url : '/compra/edit/:id',
        templateUrl: 'src/admin/controllers/compra-create.html',
        controller : 'CompraEditController',
        controllerAs : 'vm',
        resolve : {
        	compraPreService : compraPreService 
        }
      });

      compraPreService.$inject = ['Service', '$stateParams'];
      function compraPreService(Service, $stateParams){
      	var id = $stateParams.id;
      	return Service.getCompraById(id);
      }
  };

  CompraEditController.$inject = ['$scope','$location', '$rootScope','$state','Service', 'compraPreService'];
  function CompraEditController($scope, $location, $rootScope,$state, Service, compraPreService){
    if("undefined" === typeof $rootScope.userLogado){
      $location.path('/');//redireciona para login
   
    } else {
      var isOK = Service.verificaPermissao($rootScope.userLogado, 'roleCompraCad');
     if(!isOK){
        $location.path('/');//redireciona para login
     }
    }
    $rootScope.messageWarning = '';
    $rootScope.messageSuccess = '';
    var vm = this;
    vm.compra = compraPreService.data;
    vm.save = save;
    Pace.restart();

    function save() {
      Service
        .editCompra(vm.compra)
        .then(CompraEditSuccess);
    }

    function save(){
      Pace.restart();
      if ($scope.formCompraCreate.$valid) {
          Service
            .editCompra(vm.compra)
            .then(CompraEditSuccess);
      }else{
        if(!$scope.formCompraCreate.nomeLoja.$valid)
          $scope.formCompraCreate.nomeLoja.$pristine = false;

        if(!$scope.formCompraCreate.valorTotalCompra.$valid)
          $scope.formCompraCreate.valorTotalCompra.$pristine = false;
          $rootScope.messageSuccess = '';
          $rootScope.messageWarning = 'Por favor, informe os campos obrigatórios'; 
      }
    }

    function CompraEditSuccess(response){
      $rootScope.messageWarning = '';
      $rootScope.messageSuccess = response.data.message;
      $state.go('app.compra-list');
    }


    //valor monetario
    function onlyMoneyValor(e, myValue) {
      var keyCode = (e.which) ? e.which : e.keyCode;
      if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
          e.preventDefault();
      }else {
        vm.compra.valorTotalCompra += String.fromCharCode(keyCode);  
        e.preventDefault();
      }
    }
  }
}());