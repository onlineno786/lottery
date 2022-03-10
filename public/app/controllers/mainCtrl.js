/*
    Controller written by - Pankaj tanwar
*/

angular.module('mainController', ['authServices'])

.controller('mainCtrl', function ($window,$http, auth, $timeout, $location, authToken, $rootScope, user) {

    var app = this;

    app.loadme = false;
    app.home = true;
    app.login = true;

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        //console.log($window.location.pathname);
        if(next.$$route) {
            //console.log('we are not at home page');
            app.home = false;
        } else {
            app.home = true;
        }

        if(auth.isLoggedIn()) {

            app.isLoggedIn = true;
            auth.getUser().then(function (data){
                app.name = data.data.name;
                app.mobileNumber = data.data.mobileNumber;
                app.role = data.data.role;
                app.userId = data.data._id;
                app.loadme = true;
                app.authorized = (data.data.role === 'ADMIN');
            });

        } else {

            app.isLoggedIn = false;
            app.name = '';

            app.loadme = true;
        }
    });

    this.changeAuth = () => {
        app.successMsg = '';
        app.errorMsg = '';
        app.login = !app.login;
    }


    this.doLogin = function (logData) {
        //console.log(this.logData);
        app.successMsg = '';
        app.errorMsg = '';
        app.loading = true;
        app.expired = false;
        app.disabled = false;

        auth.login(app.logData).then(function (data) {
            if(data.data.status) {
                app.loading = false;
                app.successMsg = 'User authenticated. Logging in...';
                $timeout(function () {
                    $location.path('/settings');
                    app.logData = '';
                    app.successMsg = false;
                }, 2000);
            } else {
                app.disabled = false;
                app.loading = false;
                app.errorMsg = data.data.response.message;
            }
        });
    };

    this.doSignup = function (signupData) {
        //console.log(this.logData);
        app.successMsg = '';
        app.errorMsg = '';
        app.loading = true;
        app.expired = false;
        app.disabled = false;

        console.log(app.signupData);
        auth.signup(app.signupData).then(function (data) {
            if(data.data.status) {
                app.loading = false;
                app.successMsg = 'User registered!';
            } else {
                app.disabled = false;
                app.loading = false;
                app.errorMsg = data.data.response.message;
            }
        });
    };

    this.logout = function () {
        auth.logout();
        $location.path('/logout');
        $timeout(function () {
            $location.path('/');
        }, 1000);
    };
});
