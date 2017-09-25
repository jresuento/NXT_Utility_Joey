'use strict';

angular.
module('gannet').
component('gannetView', {
	templateUrl: 'gannet/gannet.template.html',
	controller: ['Utils', 'Rest', 'Cookies', 
		function GannetController(Utils, Rest, Cookies) {
			var self = this;
			self.entityHistory = null,
			self.showLogDetailsObj = null

			Rest.getEntityConfig.get().$promise
			.then(res => {
				self.entityConfig = res
			})
			Rest.getStatusMessages.get().$promise
			.then(res => {
				self.statusMessages = res.messages
			})
			Rest.authorization = self.authorization = Cookies.getSSID();
			self.hasError = !1;
			self.hasMsg = !1;

			self.showMsg = function(msg, iserr){
				!!iserr && (self.hasMsg = !1, self.hasError = !0) || (self.hasError = !1, self.hasMsg = !0)
				this.statusMsg = msg;

				setTimeout(function(){ 
					self.hasError = !1, self.hasMsg = !1; //only works if you interact in the page
				}, 3000);
			}

			function validateAd(AdID){
				return !!((AdID.replace(/\s/g) * 1) + 1);
			}

			self.adQueue = [];
			self.adQueueCopies = [];
			self.adlogs = [];

			function hasCustomScript(adURLs){
				let flag = !1;
				for(let i =0; i<adURLs.length; i++){
					let adURL = adURLs[i];
					if(adURL.type == "ThirdPartyURL" && adURL.urlType == "PRELOAD" && (adURL.url.toLowerCase().indexOf(self.targetCS.substr(self.targetCS.toLowerCase().indexOf('pl_addcss_ncm'), self.targetCS.length).toLowerCase()) > -1)){
						flag = !0;
						break;
					}									
				}
				return flag
			}

			function updateAd(AdID){
				self.adlogs.push(Utils.format('Processing AdID {0}', AdID));	
				var adResult;
				return new Promise((resolve, reject) => {
					if(!validateAd(AdID)){
						self.adlogs.push('AdID is not valid numeric value');
						reject('AdID is not valid numeric value');
					} else {
						Rest.getAd().start({
						'adID': 	AdID
						}).$promise
						.then(res => {
							adResult = res.result;
							if(adResult.adURLs && hasCustomScript(adResult.adURLs)){
								self.adlogs.push('Ad already has the relevant custom script');
								resolve('Ad already has the relevant custom script');
								return new Promise((a, b) => {
									a(adResult)
								})
							} else {
								if(!adResult.adURLs) adResult.adURLs = [];
								adResult.adURLs.push({
									"type": "ThirdPartyURL",
									"urlType": "PRELOAD",
									"urlSource": "AD",
									"url": self.targetCS
								});
								let requestBody = {}, requestBodyStr;
								requestBody.entities = [];
								requestBody.entities.push(adResult);
								requestBodyStr = JSON.stringify(requestBody)
								return Rest.updateAd().start({
									'adID': AdID
								}, requestBodyStr).$promise
							}
						})
						.then(res => {
							if(adResult.numberOfPlacementAds > 0){
								//self.adQueueCopies = []; //we clear the ad copies queue here
								self.adlogs.push('Ad has placementAds.. processing..');
								return Rest.getPlacementAds().start({
									'masterAdID': AdID
								}).$promise
							} else {
								self.adlogs.push('Ad has no placementAds');
								resolve('Ad has no placementAds');
								return new Promise((a, b) => {
									a();
								})
							}
						}).
						then(res => {
							if(res && res.result && res.result.length > 0){
								for(let i=0;i<res.result.length;i++)
									self.adQueueCopies.push(res.result[i].id)

								self.adlogs.push('Ad copies are pushed to queue')
								resolve('Ad copies are pushed to queue')
							}
						})
						.catch(err => {
							self.adlogs.push('Ad was not updated successfully..')
							self.adlogs.push(err)
							reject('Ad was not updated successfully..')
						})
					}										
				});
			}

			function updateAds(){
				return new Promise((resolve, reject) => {
					function _update(){
						if(self.adQueue.length == 0 && self.adQueueCopies.length == 0){
							self.adlogs.push('Queues are empty..')
							resolve('Queues are empty..');
							return new Promise((a, b) => {
								b();
							})
						}
						var ad = self.adQueueCopies.length > 0 ? self.adQueueCopies.shift() : self.adQueue.shift();	
						return updateAd(ad);
					}

					function iterate(_promise){
						function a(){
							iterate(_update())
						}
						if(!(self.adQueue.length == 0 && self.adQueueCopies.length == 0)){
							_promise
							.then(a)
							.catch(a)
						}
					}
					
					iterate(_update())
				});
			}

			self.submit = function(){
				self.adQueue = self.adIDs.split(',');
				updateAds()
				.then(() => {
					console.log('log', self.adlogs);
				})
				.catch(() => {
					console.log('log', self.adlogs);
				})
			}
		}	
	]
});
