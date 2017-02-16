
'use strict';
angular.module("app.auth")

.controller('authCtrl', ['$rootScope', '$scope', 'authService', '$timeout', function($rootScope, $scope, authService, $timeout){
	
    $scope.user = {};
    $scope.token = { value: window.localStorage.token, loggedIn: false };
    if ($scope.token.value) {
        $scope.token.loggedIn = true;
    }

        $scope.login = function() {
           
            authService.login($scope.user, function(data) {
                    $scope.token.value = data.token;
                    authService.setToken(data.token);
                    authService.setUser(data.user);
                    $scope.token.loggedIn = true;
               window.location.reload();
                console.log(data.token);
            }, function(err) {
                $rootScope.error = 'Error al iniciar sesión';
                
            });
        };
 
        $scope.logout = function() {
            window.localStorage.removeItem('token');
            $scope.token = {loggedIn: false};
            window.location.reload();
        };
    }]);
