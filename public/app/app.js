angular.module('userApp', ['userRoutes','userCtrl', 'mainController', 'userFilters'])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});