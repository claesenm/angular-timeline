'use strict';

var app = angular.module('cm-timeline', [
	'ngSanitize',
  'ui.router',
  'angular-timeline',
	'angular-scroll-animate'
]);

app.config(function($stateProvider) {
  $stateProvider.state('user', {
    url:         '',
    controller: 'Cm-timelineCtrl',
    templateUrl: 'cm-timeline.html'
  });
});
