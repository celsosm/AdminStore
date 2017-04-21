(function(){
'use strict';
angular
  .module('CompraCreateControllers',[])
  .config(config)
  .controller('CompraCreateController', CompraCreateController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.admin-create-compra',{
        url : '/compra/create',
        templateUrl: 'src/admin/controllers/compra-create.html',
        controller : 'CompraCreateController',
        controllerAs : 'vm'
      });
  };

  CompraCreateController.$inject = ['$location', '$rootScope','$state', '$scope', 'Service'];
  function CompraCreateController($location, $rootScope,$state, $scope, Service){
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
    var compra = {  
                    valorTotalCompra:'',
                    ativo:  'Sim'
                  }
    vm.compra = compra;
    vm.save = save;
    
    vm.onlyMoneyValor = onlyMoneyValor;
    vm.limparValorDeCompra = limparValorDeCompra;

    function save(){
      Pace.restart();
      if ($scope.formCompraCreate.$valid) {
          Service
            .compraCreate(vm.compra)
            .then(CompraCreateSuccess);
      }else{
        if(!$scope.formCompraCreate.nomeLoja.$valid)
          $scope.formCompraCreate.nomeLoja.$pristine = false;

        if(!$scope.formCompraCreate.valorTotalCompra.$valid)
          $scope.formCompraCreate.valorTotalCompra.$pristine = false;
          $rootScope.messageSuccess = '';
          $rootScope.messageWarning = 'Por favor, informe os campos obrigatórios'; 
      }
    }

    function CompraCreateSuccess(response){
      $rootScope.messageWarning = '';
      $rootScope.messageSuccess = response.data.message;
      var compra = {  
                    valorTotalCompra:'',
                    ativo:  'Sim'
                  }
      vm.compra = compra;
      //$state.reload();
      //$state.go('app.compra-list')
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

    function limparValorDeCompra(){
      vm.compra.valorTotalCompra = '';
    }

  }
}());