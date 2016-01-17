app.config(function ($stateProvider) {

    $stateProvider.state('adminUser', {
        url: '/admin/users',
        templateUrl: 'js/admin/users.html',
        controller: 'AdminUserCtrl',
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

app.controller('AdminUserCtrl', function ($scope, AuthService, $state, user, apartments) {
    $scope.user = user;
});
