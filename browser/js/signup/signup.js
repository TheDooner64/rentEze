app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });

});

app.controller('SignupCtrl', function ($scope, AuthService, $state) {

    $scope.signup = {};
    $scope.error = null;

    // NOTE: Need to create a new function to send the signup data
    // $scope.sendSignup = function (signupInfo) {

    //     $scope.error = null;

    //     AuthService.signup(signupInfo).then(function () {
    //         $state.go('home');
    //     }).catch(function () {
    //         $scope.error = 'Invalid signup credentials.';
    //     });

    // };

});
