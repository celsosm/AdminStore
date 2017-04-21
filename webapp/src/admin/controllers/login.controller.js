(function(){
'use strict';
angular
  .module('LoginControllers',[])
  .config(config)
  .controller('LoginController', LoginController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.log-in',{
        url : '/',
        templateUrl: 'src/admin/controllers/login.html',
        controller : 'LoginController',
        controllerAs : 'vm'
      });
  };

     
  LoginController.$inject = ['$state', '$scope', 'Service', '$rootScope'];
  function LoginController($state, $scope, Service, $rootScope){
    var vm = this;
    var user = {              
                  login: '',
                  senha:  ''
                };
    vm.user = user;
    vm.login = login;
   // var userLogado = {avatar:'avatar04.png'};
    $rootScope.userLogado = "";
    $rootScope.showLayoutLogin = true;
    $rootScope.messageWarning = '';
    $rootScope.messageSuccess = '';
    
    function login(){
      if ($scope.formLogin.$valid) {
         $scope.userForm = {              
                          login:  vm.user.login,
                          senha:  vm.user.senha
                        }

          Service
              .findUser($scope.userForm)
              .then(LoginSuccess);
                
      }else{
        if(!$scope.formLogin.login.$valid)
          $scope.formLogin.login.$pristine = false;
        if(!$scope.formLogin.senha.$valid)
          $scope.formLogin.senha.$pristine = false;

           $scope.showMessageAlert= true;
         $scope.message = 'Por favor, informe os campos obrigatórios'; 
      }
    }

    function LoginSuccess(response){
      angular.forEach(response.data, function (user) {
          if(user.login == $scope.userForm.login && user.senha == $scope.userForm.senha){
            $rootScope.userLogado = user;
            $rootScope.showLayoutLogin = false;
          }
      });

      if($scope.userLogado != ''){
          $scope.showMessageSucess = true;
          $scope.message = 'Aguande, iniciando o sistema'; 
          $state.go('app.admin-create-venda');          
           
      }else{
        $scope.message = 'Usuário não localizado no sistema. Por favor tente novamente.';  
        $scope.showMessageAlert= true;
      }
      
    }
     
  }
}());