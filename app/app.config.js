'use strict';

angular.
module('JoeyNXTUtil').
config(['$locationProvider' ,'$routeProvider',
function config($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');
	$routeProvider.
	when('/home', {
		template: '<home-view></home-view>'
	}).
	when('/history', {
		template: '<history-view></history-view>'
	}).        
	when('/gannet', {
		template: '<gannet-view></gannet-view>'
	}).
	otherwise('/home');
}
]);
