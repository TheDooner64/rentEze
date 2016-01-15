app.config(function ($stateProvider) {

    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/admin/admin.html',
        controller: 'AdminCtrl',
        data: {
            isAdmin: true
        },
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    });

});

app.controller('AdminCtrl', function ($scope, AuthService, $state, user) {
    $scope.user = user;
});
