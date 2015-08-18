'use strict'

angular.module '<%= scriptAppName %>'
.controller 'LoginCtrl', ($scope, Auth<% if (filters.ngroute) { %>, $location<% } %><% if (filters.uirouter) { %>, $state<% } %><% if (filters.oauth) {%>, $window<% } %>) ->
  $scope.user = {}
  $scope.errors = {}
  $scope.login = (form) ->
    if form.$valid
      # Logged in, redirect to home
      Auth.login
        email: $scope.user.email
        password: $scope.user.password

      .then ->
        <% if (filters.ngroute) { %>$location.path '/'<% } %><% if (filters.uirouter) { %>$state.go 'main'<% } %>

      .catch (err) ->
        $scope.errors.other = err.message

      .finally ->
        $scope.submitted = true

    else
      $scope.submitted = true
<% if (filters.oauth) {%>
  $scope.loginOauth = (provider) ->
    $window.location.href = '/auth/' + provider<% } %>
