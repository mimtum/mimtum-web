angular.module("app.auth")

.service('authService', ['$http', function($http){
        //this.url = "http://api.mimtum.com/v1/api-token-auth/";        
        this.url = "http://192.168.0.100:8000/v1/api-token-auth/";
        this.login = function (user, success, error) {
            var self = this;
            $http.post(this.url, user).then(function(res){
                console.log(res);
               //self.setToken(res.data.token);
               $('#modal1').modal('close');
               success(res.data);
            }, function(err) {
                error(err);
            });
        }
        this.setToken = function(token){
                window.localStorage.setItem('token', token);
        }
        this.getToken = function(){
               return window.localStorage.getItem('token');
        }    
        this.setUser = function(user){
            window.localStorage.setItem('user', JSON.stringify(user));
        }
        this.getUser = function(){
          return JSON.parse(window.localStorage.getItem('user'));
        }
    }
]);
