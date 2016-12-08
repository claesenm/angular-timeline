'use strict';

/**
 * @ngdoc directive
 * @name angular-timeline.directive:timeline-date
 * @restrict AE
 *
 * @description
 * An panel inside the `timeline-event` which shows detailed information about the event.
 */
angular.module('angular-timeline').directive('timelineDate', function() {
  return {
    require: '^timeline',
    restrict: 'AE',
    transclude: true,
    template: '<div class="timeline-date" ng-transclude></div>'
  };
});
