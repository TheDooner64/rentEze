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
            },
            apartments: function(ApartmentFactory) {
                return ApartmentFactory.getAllApartments();
            }
        }
    });

});

app.controller('AdminCtrl', function ($scope, AuthService, $state, user, apartments) {
    $scope.user = user;
});
