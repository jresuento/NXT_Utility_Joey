'use strict';

angular.module('core.rest').
factory('Rest', ['$resource',
function($resource){
	class Rest{
		constructor(){
			var self = this;
			self.authorization = null
			this.login = $resource('https://api.sizmek.com/rest/login/login/', {}, {
				start : {
					'method' : 'POST',
					isArray: false
				}					
			})		
			this.getEntityConfig = $resource('config/entities.json')
			this.getStatusMessages = $resource('config/statusmessages.json')
		}
		getHistory(){
			return $resource('https://api.sizmek.com/rest/history/entityhistory?id=:entityID&type=:entityType&sort=changedDate&order=desc', {}, {
				start : {
					'method' : 'GET',
					'headers' : {
						'Authorization' : this.authorization
					},
					isArray: false
				}					
			})			
		}
		getAd(){
			return $resource('https://api.sizmek.com/rest/ads/:adID', {}, {
				start : {
					'method' : 'GET',
					'headers' : {
						'Authorization' : this.authorization
					},
					isArray: false
				}					
			})	
		}
		getPlacementAds(){
			return $resource('https://api.sizmek.com/rest/ads?adId=:masterAdID&from=0&max=499&order=asc&sort=id', {}, {
				start : {
					'method' : 'GET',
					'headers' : {
						'Authorization' : this.authorization
					},
					isArray: false
				}					
			})
		}
		updateAd(){
			return $resource('https://api.sizmek.com/rest/ads/:adID', {}, {
				start : {
					'method' : 'PUT',
					'headers' : {
						'Authorization' : this.authorization
					},
					isArray: false
				}					
			})
		}
	}
	return new Rest
}]);