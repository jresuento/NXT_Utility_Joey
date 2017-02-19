'use strict';

angular.module('core.rest').
factory('Rest', ['$resource',
function($resource){	
	return {
		'login' : $resource('https://api.sizmek.com/rest/login/login/', {}, {
			start : {
				'method' : 'POST',
				isArray: false
			}					
		}),
		'getHistory' : $resource('https://mdx.sizmek.com/rest/history/entityhistory?id=:entityID&type=:entityType&sort=changedDate&order=desc', {}, {
			start : {
				'method' : 'GET',
				'headers' : {
					'Authorization' : self.authorization
				},
				isArray: false
			}					
		}),
		'getEntityConfig' : $resource('config/entities.json')
	}	
}]);