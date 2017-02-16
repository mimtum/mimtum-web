angular.module("app.classroom")

.service('classroomService', ['$http', 'authService', '$q', function($http, authService, $q) {
	//this.url = "http://api.mimtum.com/v1/classrooms/";
	this.url = "http://192.168.0.100:8000/v1/classrooms/";
	this.distanceUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=11.225472,-74.186836&destinations=11.224878,-74.186728&key=AIzaSyC0vhsF-TM-SDjJ3dvM0euMVT_G66sAP8s";
	this.getAll = function() {
		var token = authService.getToken();
		if(token){
			var config = {
				url: this.url,
				method: "GET",
				headers : {
					Authorization: "Token " + token
				}
			};
			return $http(config).catch(this.handleError);
		} 
		return $q.resolve(false);

	};

	this.patch = function(id, classroom, token){
		var config = {
			url: this.url+id+'/',
			method: "patch",
			data: classroom,
			headers : {
				Authorization: "Token " + token
			}
		}
		return $http(config);
	}

	this.distance = function(coordenadas, success, error){
		$http({
			method: 'GET',
			url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+coordenadas.origin+'&destinations='+coordenadas.destination+'&language=fr-FR&key=AIzaSyC0vhsF-TM-SDjJ3dvM0euMVT_G66sAP8s'
			
		}).then(function(res){
			success(res);
		}, function(err){
			error(err);
		});
	};

    this.handleError = function (err) {
    	console.error(err);
    }
}]);
