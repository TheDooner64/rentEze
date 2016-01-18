app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function($scope, AuthService, $state, FavoritesFactory) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function(loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function(user) {
            FavoritesFactory.moveFavoritesToUser();
            if (user.isAdmin) {
                $state.go('admin');
            }
            else $state.go('home');
        }).catch(function() {
            $scope.error = 'Invalid login credentials.';
        });

    };

});
