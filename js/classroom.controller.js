angular.module("app.classroom")
.controller('classroomCtrl', ['$scope', 'classroomService', 'authService', '$rootScope', '$timeout', 
 function($scope, classroomService, authService, $rootScope, $timeout) {

  //var MAX_DISTANCE = 500000;
  var MAX_DISTANCE = 50;
  var map, data;
  var markers = [];

  $scope.bloqueado = false;
  $scope.url_1='https://maps.googleapis.com/maps/api/streetview?size=300x150&location=';
  $scope.url_2='&heading=151.78&pitch=-0.76&key=AIzaSyC0vhsF-TM-SDjJ3dvM0euMVT_G66sAP8s';

  initialize(); //init map

  classroomService.getAll()
  .then(function(res){
    $scope.classrooms = res.data;
    if (authService.getToken) {
      mark(true);
    } else {
      mark(false);
    }
  });


  function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: new google.maps.LatLng(11.225472, -74.186836),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }

  $scope.block = function (blockValue){
    var classroom = {
      is_busy: blockValue
    };

    if(!$scope.aula){
      Materialize.toast('Debe seleccionar un aula disponible', 4000);
    } else {
      if(!$scope.aula.is_busy){

        var destino = $scope.aula.location.split(",");
        var pos_1 = new google.maps.LatLng($scope.lat,$scope.lon);
        var pos_2 = new google.maps.LatLng(destino[0],destino[1]);

        $scope.distancia = google.maps.geometry.spherical.computeDistanceBetween(pos_1, pos_2);

        if($scope.distancia < MAX_DISTANCE) {
          performUpdate(classroom);
        } else {
          Materialize.toast("Su distancia al aula libre es de "+$scope.distancia.toFixed(2)+
                            " Metros debe acercarse a mínimo 50 Metros o buscar un aula que cumpla esta condición", 6000);
        }
      } else {
        if($scope.aula.current_user == authService.getUser().id && !blockValue) {  //desbloquear
          performUpdate(classroom);               
        } else {
          Materialize.toast('Las aulas disponibles son las que tienen ícono de color verde, selecciona otra', 5000);
        }
      }
    }
  }

  function performUpdate(classroom) {
    classroomService.patch($scope.aula.id, classroom, authService.getToken())
    .then(function(res){
      if(res.data.is_busy) {
        Materialize.toast('¡Puede usar el aula libre justo ahora!', 4000);
        $scope.bloqueado = true;
      } else {
        Materialize.toast('Aula desbloqueada', 4000);
        $scope.bloqueado = false;
      }
      //find classroom and update
      var c = $scope.classrooms.find(function(item){
        return item.id == res.data.id; 
      });
      c.is_busy = res.data.is_busy;
      resetMap(); 
    }, function(err){
      $rootScope.error = 'No se puede bloquear el aula';
      Materialize.toast($rootScope.error, 4000);
    });
  }

  function mark(showAll){
    $scope.user = authService.getUser();

    var infowindow = new google.maps.InfoWindow();
    var i, ico, btn=[];
    console.log($scope.classrooms);
    for (i = 0; i < $scope.classrooms.length; i++) {  
      if ($scope.classrooms[i].is_busy==false && showAll) {
        ico ='http://imageshack.com/a/img923/1632/d4SJUF.png';
        btn[i]='Para ocupar esta aula clic el boton bloquear aula';
      } else if ($scope.classrooms[i].is_busy==true && $scope.user.id==$scope.classrooms[i].current_user){
        ico = 'http://imageshack.com/a/img924/2991/OW8apT.png';
        btn[i]='';
        $scope.bloqueado = true;
      } else {
        ico = 'http://imageshack.com/a/img923/8905/JvEnko.png';
        btn[i] = '';
      }
      var coordenadas = $scope.classrooms[i].location.split(",");

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(coordenadas[0],coordenadas[1]),
        map: map,
        icon: ico, 
        animation: google.maps.Animation.DROP, 
        title: $scope.classrooms[i].slug
      });
      markers.push(marker);

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {       
          var contentStreet = '<div class ="center"><h4>'+$scope.classrooms[i].slug+
            '</h4><img class="img-responsive" src="'+$scope.url_1+$scope.classrooms[i].location+$scope.url_2+'">'+
              '<br>'+btn[i]+' </div>';
              infowindow.setContent(contentStreet);
              infowindow.open(map, marker);  
              $scope.aula = $scope.classrooms[i];
        }
      })(marker, i));
    }
  }

  function resetMap(){
    markers.forEach(function(marker){
      marker.setMap(null);
    });
    markers = [];
    mark(true);
  }

  function geoLocalization(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(coordenadas);
    } else {
      alert("no es posible activar GeoLocalización");
    }
  }

  function coordenadas(position) {
    $scope.lat = position.coords.latitude;
    $scope.lon = position.coords.longitude;

    marker = new google.maps.Marker({
      position: new google.maps.LatLng($scope.lat, $scope.lon),
      map: map,
      animation: google.maps.Animation.DROP, 
      title: 'Mi posición'
    });
  }

  geoLocalization();
}]);
