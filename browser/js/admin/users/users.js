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
            },
            loggedInUser: function(AuthService) {
                if (AuthService.isAuthenticated()) return AuthService.getLoggedInUser();
            },
        }
    });

});

app.controller('AdminUserCtrl', function ($scope, AuthService, $state, users, AdminFactory, UserFactory, loggedInUser) {
    $scope.users = users;
    $scope.currentUser = loggedInUser;

    $scope.makeAdmin = function(user) {
        // Function that makes the passed in user into an admin
        AdminFactory.updateUser(user, { isAdmin: true })
            .then(function() {
                return UserFactory.getAllUsers();
            }).then(function(users) {
                $scope.users = users;
            }).then(null, console.error);
    };

    $scope.deleteUser = function(user) {
        AdminFactory.deleteUser(user)
            .then(function() {
                return UserFactory.getAllUsers();
            }).then(function(users) {
                $scope.users = users;
            }).then(null, console.error);
    };

});
