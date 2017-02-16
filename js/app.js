/*
 * Definicion de modulos 
 */

angular.module("app", ["app.classroom", "app.auth"]);

angular.module("app.auth", []);
angular.module("app.classroom", ["app.auth"]);
