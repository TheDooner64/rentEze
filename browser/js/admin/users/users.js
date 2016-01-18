app.config(function ($stateProvider) {

    $stateProvider.state('adminUser', {
        url: '/admin/users',
        templateUrl: 'js/admin/users/users.html',
        controller: 'AdminUserCtrl',
        data: {
            isAdmin: true
        },
        resolve: {
            users: function(UserFactory) {
                return UserFactory.getAllUsers();
            }
        }
    });

});

app.controller('AdminUserCtrl', function ($scope, AuthService, $state, users) {
    $scope.users = users;
});
