app.config(function ($stateProvider) {

    $stateProvider.state('adminApt', {
        url: '/admin/apartments',
        templateUrl: 'js/admin/apartments/apartments.html',
        controller: 'AdminAptCtrl',
        data: {
            isAdmin: true
        }
    });

});

app.controller('AdminAptCtrl', function ($scope, AuthService, $state, AdminFactory) {

});
