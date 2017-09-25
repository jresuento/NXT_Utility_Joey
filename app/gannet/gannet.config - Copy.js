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

			//#180719
			self.z180719adQueue = [];
			self.z180719adQueueCopies = [];
			self.z180719logs = [];
			self.z180719CS = 'https://secure-ds.serving-sys.com/BurstingRes/CustomScripts/PL_AddCSS_NCM.js?css1=div%5Bid%5E%3D%22ebBannerDiv_%5B%25tp_adid%25%5D%22%5D%7Bheight%3A415px!%7Dbanneriframe%7Bdisplay%3Ainitial!%3B%7D';

			function z180719UpdateAd(AdID, IsCopy){

				self.z180719logs.push(Utils.format('Processing Ad ID: {0}', AdID))

				function validate(){
					return !!((AdID.replace(/\s/g) * 1) + 1);
				}

				function hasCustomScript(adURL){					
					return (adURL.type == "ThirdPartyURL" && adURL.urlType == "PRELOAD" && (adURL.url.toLowerCase().indexOf(self.z180719CS.substr(self.z180719CS.toLowerCase().indexOf('pl_addcss_ncm'), self.z180719CS.length).toLowerCase()) > -1))
				}

				return new Promise((resolve, reject) => {				
					if(!validate(AdID)){
						self.z180719logs.push('Ad is not numeric')
						reject('Ad is not numeric')		
					}

					Rest.getAd().start({
						'adID': 	AdID
					}).$promise
					.then(res => {
						let ad = res.result;
						let flg_hasCustomScript = false;
						if(ad.adURLs){
							for(let i =0; i<ad.adURLs.length; i++){
								if(hasCustomScript(ad.adURLs[i])){
									flg_hasCustomScript = !0;
									break;
								}									
							}
						}

						if(flg_hasCustomScript){
							self.z180719logs.push('Ad has custom script')
							resolve('Ad has custom script');
						} else {
							if(!ad.adURLs) ad.adURLs = [];
							ad.adURLs.push({
								"type": "ThirdPartyURL",
								"urlType": "PRELOAD",
								"urlSource": "AD",
								"url": self.z180719CS
							})

							let requestBody = {}, requestBodyStr;
							requestBody.entities = [];
							requestBody.entities.push(ad);
							requestBodyStr = JSON.stringify(requestBody)
							
							Rest.updateAd().start({
								'adID': AdID
							}, requestBodyStr).$promise
							.then(res => {
								reject('Update Ad success');
							})
							.catch(err => {		
								self.showMsg(JSON.stringify(err.data), !0)
								reject('Update Ad failed');
							});
						}
					})
					.catch(err => {
						self.z180719logs.push('Get Ad Failed')
						reject('Get Ad Failed');
					});
				});
			}

			function z180719Iterator(queue, IsCopy){
				console.log('logs', self.z180719logs);
				return new Promise((resolve, reject) => {
					if(queue.length == 0){
						self.z180719logs.push('Queue is empty')
						resolve('Queue is empty');
					} else {
						var AdID = queue.shift();
						z180719UpdateAd(AdID, IsCopy)
						.then(() => { z180719Iterator(queue, IsCopy) })
						.catch(() => { z180719Iterator(queue, IsCopy) })
					}
				});
			}

			self.submit180719 = function(){
				self.z180719adQueue = self.input180719.split(',')
				z180719Iterator(self.z180719adQueue)
				.then(() => { 
					console.log('z180719Iterator done');
				})
				.catch(() => {
					console.log('z180719Iterator failed');
				})
			}
		}	
	]
});
