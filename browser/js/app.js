'use strict';
window.app = angular.module('FullstackGeneratedApp', ['oi.select','fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'LocalStorageModule', 'validation.match']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Allow auth requests
    $urlRouterProvider.when('/auth/:provider', function() {
      window.location.reload();
    })
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
        return state.data && state.data.authenticate;
    };

    var destinationStateRequiresAdmin = function(state) {
        return state.data && state.data.isAdmin;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (destinationStateRequiresAdmin(toState)) {
            // The destination state does not require admin
            // Short circuit with return.
            if (AuthService.isAuthenticated() && AuthService.isAdmin()) {
                // the user has admin status
                return;
            }

            // Cancel navigating to new state.
            event.preventDefault();

            AuthService.getLoggedInUser().then(function (user) {
                // If a user is retrieved, then renavigate to the destination
                // (the second time, AuthService.isAuthenticated() will work)
                // otherwise, if no user is logged in, go to "login" state.
                if (!user) {
                    $state.go('login');
                } else if (user.isAdmin) {
                    $state.go(toState.name, toParams);
                } else {
                    // FIGURE OUT HERE TO DIRECT IF NOT AUTHORIZED
                    console.log('add html that says not authorized user?')
                    $state.go('home');
                }
            });

        }

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });

    });

});
