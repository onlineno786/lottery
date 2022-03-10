var app = angular.module('userRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider

            .when('/logout', {
                templateUrl : '/app/views/authentication/logout.html',
                authenticated : false
            })            
            
            .when('/register', {
                templateUrl : '/app/views/authentication/register.html',
                authenticated : false
            })

            .when('/prizes', {
                templateUrl : 'app/views/dashboard/prize/prizes.html',
                authenticated : true,
                permission : ['ADMIN', 'USER'],
                controller : 'prizesCtrl',
                controllerAs : 'prizes'
            })

            .when('/my-purchases', {
                templateUrl : 'app/views/dashboard/prize/my-purchases.html',
                authenticated : true,
                permission : [ 'USER'],
                controller : 'myPurchasesCtrl',
                controllerAs : 'myPurchases'
            })

            .when('/result/:purchaseId', {
                templateUrl : 'app/views/dashboard/prize/result.html',
                authenticated : true,
                permission : [ 'USER'],
                controller : 'resultCtrl',
                controllerAs : 'result'
            })

            .when('/add-prize', {
                templateUrl : 'app/views/dashboard/prize/add-prize.html',
                authenticated : true,
                permission : ['ADMIN'],
                controller : 'addPrizeCtrl',
                controllerAs : 'addPrize'
            })

            .when('/prize/:prizeId', {
                templateUrl : 'app/views/dashboard/prize/prize.html',
                authenticated : true,
                permission : ['ADMIN', 'USER'],
                controller : 'prizeCtrl',
                controllerAs : 'prize'
            })

            .when('/users', {
                templateUrl : 'app/views/user/users.html',
                authenticated : true,
                permission : ['ADMIN'],
                controller : 'usersCtrl',
                controllerAs : 'users'
            })

            .otherwise( { redirectTo : '/'});

        $locationProvider.html5Mode({
            enabled : true,
            requireBase : false
        })
    });

app.run(['$rootScope','auth','$location', 'user', function ($rootScope,auth,$location,user) {

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        if(next.$$route) {

            if(next.$$route.authenticated === true) {

                if(!auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/');
                } else if(next.$$route.permission) {
                    auth.getUser().then(function (data) {
                        if(next.$$route.permission.indexOf(data.data.role.toUpperCase()) === -1) {
                            event.preventDefault();
                            $location.path('/');
                        }
                    });
                }

            } else if(next.$$route.authenticated === false) {

                if(auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/profile');
                }

            } /*else {
                console.log('auth doesnot matter');
            }
            */
        } /*else {
            console.log('Home route is here');
        }
*/
    })
}]);

