(function(){
'use strict';
angular
  .module('ClienteCreateControllers',[])
  .config(config)
  .controller('ClienteCreateController', ClienteCreateController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.admin-create-cliente',{
        url : '/cliente/create',
        templateUrl: 'src/admin/controllers/cliente-create.html',
        controller : 'ClienteCreateController',
        controllerAs : 'vm'
      });
  };

  ClienteCreateController.$inject = ['$location', '$rootScope','$state', '$scope', 'Service'];
  function ClienteCreateController($location, $rootScope,$state, $scope, Service){
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
    var cliente = {
                      ativo:  'Sim'
                    }

    vm.cliente = cliente;
    vm.save = save;


    function save(){
      Pace.restart();
      if ($scope.formClienteCreate.$valid) {
          var cliente = {
                          nomeCliente: vm.cliente.nomeCliente,
                          contato: vm.cliente.contato,
                          ativo:  vm.cliente.ativo
                        }

          Service
            .clienteCreate(cliente)
            .then(ClienteCreateSuccess);
      }else{
        if(!$scope.formClienteCreate.nomeCliente.$valid)
          $scope.formClienteCreate.nomeCliente.$pristine = false;
          $rootScope.messageSuccess = '';
          $rootScope.messageWarning = 'Por favor, informe os campos obrigatórios'; 
      }
    }

    function ClienteCreateSuccess(response){
      $rootScope.messageWarning = '';
      $rootScope.messageSuccess = response.data.message;
      var cliente = {
                      ativo:  'Sim'
                    }

      vm.cliente = cliente;
    }
  }
}());