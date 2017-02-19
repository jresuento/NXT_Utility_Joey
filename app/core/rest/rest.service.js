'use strict';

angular.module('core.rest').
factory('Rest', ['$resource',
function($resource){
	class Rest{
		constructor(){
			this.login = $resource('https://api.sizmek.com/rest/login/login/', {}, {
				start : {
					'method' : 'POST',
					isArray: false
				}					
			})
			this.getHistory = $resource('https://mdx.sizmek.com/rest/history/entityhistory?id=:entityID&type=:entityType&sort=changedDate&order=desc', {}, {
				start : {
					'method' : 'GET',
					'headers' : {
						'Authorization' : self.authorization
					},
					isArray: false
				}					
			})
			this.getEntityConfig = $resource('config/entities.json')
			this.getStatusMessages = $resource('config/statusmessages.json')
		}
	}	

	return new Rest
}]);