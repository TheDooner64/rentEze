app.config(function ($stateProvider) {

    $stateProvider.state('adminApt', {
        url: '/admin/apartments',
        templateUrl: 'js/admin/apartments/apartments.html',
        controller: 'AdminAptCtrl',
        data: {
            isAdmin: true
        },
        resolve: {
            apartments: function(ApartmentFactory) {
                return ApartmentFactory.getAllApartments();
            }
        }
    });

});

app.controller('AdminAptCtrl', function ($scope, AuthService, $state, apartments, AdminFactory) {
    $scope.apartments = apartments;
    $scope.editApt = null;
    $scope.edit = false;
    $scope.add = false;

    // Adds new apartment to db
    $scope.submitNewApartment = function(aptInfo) {
        $scope.add = false;
        return AdminFactory.addApartment(aptInfo);
    };

    // Hides/shows add new apartment form
    $scope.toggleAdd = function() {
        if ($scope.add) $scope.add = false;
        else $scope.add = true;
    };

    // Edits apartment in db
    $scope.submitEdit = function(updatedApt) {
        console.log(updatedApt)
        $scope.edit = false;
        return AdminFactory.submitEdit(updatedApt);
    }

    // Puts the apartment info you want to edit on the scope
    $scope.editApartment = function(apt) {
        console.log(apt);
        $scope.editApt = apt;
        $scope.toggleEdit();
    };

    // Hides update apartment form
    $scope.toggleEdit = function() {
        if ($scope.edit) $scope.edit = false;
        else $scope.edit = true;
    };


});
