'use strict';

angular.
module('history').
component('historyView', {
	templateUrl: 'history/history.template.html',
	controller: ['$resource', 'Utils',
		function HistoryController($resource, utils) {

			var self = this;
			self.utils = utils;
			self.entitiesTypes = ($resource('config/entities.json')).get();
			self.isShowLogDetails = false;
			self.selectedHistoryID = null;
			self.selectedHistoryDetails = {};
			self.entityHistoryResult = new Array;				

			self.hideLogDetails = function(){
				self.isShowLogDetails = false;	
				self.clearSelectedRowHighlight();
			}

			self.submit = function(){		
				self.__entityHistory = ($resource('https://mdx.sizmek.com/rest/history/entityhistory?id=' + self.entityID + '&type=' + self.entityType + '&sort=changedDate&order=desc', {}, {
					getHistory : {
						'method' : 'GET',
						'headers' : {
							'Authorization' : self.authorization
						},
						isArray: false
					}					
				})).getHistory({}, function(){
					self.entityHistoryResult = new Array;
					angular.forEach(self.__entityHistory.result, function(v){
						self.entityHistoryResult.push({
							'id' : v.id,
							'changedDate' : utils.formatToDate(utils, v.changedDate),							
							'typeOfEntity' : v.typeOfEntity,
							'entityId' : v.entityId,
							'operationType' : v.operationType, 
							'changerUserName' : v.changerUserName,
							'changerUserId' : v.changerUserId, 
							'changerAccountName' : v.changerAccountName,
							'changerAccountId' : v.changerAccountId,
							'performedBy' : utils.format('{0} ({1}) | {2} ({3})', v.changerUserName, v.changerUserId, v.changerAccountName, v.changerAccountId),
							'originJsonValue' : v
						});
					});
				});				
			}

			self.highlightSelectedRow = function(id){
				self.clearSelectedRowHighlight();
				document.querySelector('.detailsBtn_' + self.selectedHistoryDetails.id).parentNode.parentNode.className += ' rowselected'
			}

			self.clearSelectedRowHighlight = function(){
				var historyTableView = document.querySelector('.history-table-view'), historyTableViewDivs = historyTableView.getElementsByTagName('div');
				for(var i = 0; i < historyTableViewDivs.length; i++){
					(historyTableViewDivs[i].className.indexOf('rowselected') > -1) && (historyTableViewDivs[i].className = historyTableViewDivs[i].className.replace('rowselected', ''))
				}
			}

			self.showLogDetails = function(){
				angular.forEach(self.entityHistoryResult, function(value) {
					if(value.id == self.selectedHistoryID) self.selectedHistoryDetails = value;
				});

				self.isShowLogDetails = true;
				self.property_change_table = '<div class=\'row property-change-table-row-header\'>';
				self.property_change_table += '<div class=\'col-md-3\'>ParentField</div>';
				self.property_change_table += '<div class=\'col-md-3\'>Field</div>';
				self.property_change_table += '<div class=\'col-md-3\'>New Value</div>';
				self.property_change_table += '<div class=\'col-md-3\'>Old Value</div>';
				self.property_change_table += '</div>';

				if(typeof self.selectedHistoryDetails.originJsonValue.propertyChange === 'undefined'){
					self.property_change_table += '<div class=\'row\'>';
					self.property_change_table += '<div class=\'col-md-12\'>No property changes to show.</div>';
					self.property_change_table += '</div>';
				} else angular.forEach(self.selectedHistoryDetails.originJsonValue.propertyChange.propertyChanges, function(v) {
					
					if(typeof v.propertyChanges != 'object'){
						self.property_change_table += '<div class=\'row\'>';
						self.property_change_table += '<div title=\'' + v.parentField + '\' class=\'col-md-3\'>' + v.parentField + '</div>';
						self.property_change_table += '<div title=\'' + v.field + '\' class=\'col-md-3\'>' + v.field + '</div>';
						self.property_change_table += '<div title=\'' + v.valueNew + '\' class=\'col-md-3\'>' + v.valueNew + '</div>';
						self.property_change_table += '<div title=\'' + v.valueOld + '\' class=\'col-md-3\'>' + v.valueOld + '</div>';
						self.property_change_table += '</div>';
					} else {
						angular.forEach(v.propertyChanges, function(vc) {							
							self.property_change_table += '<div class=\'row\'>';
							self.property_change_table += '<div title=\'' + vc.parentField + '\' class=\'col-md-3\'>' + vc.parentField + '</div>';
							self.property_change_table += '<div title=\'' + vc.field + '\' class=\'col-md-3\'>' + vc.field + '</div>';
							self.property_change_table += '<div title=\'' + vc.valueNew + '\' class=\'col-md-3\'>' + vc.valueNew + '</div>';
							self.property_change_table += '<div title=\'' + vc.valueOld + '\' class=\'col-md-3\'>' + vc.valueOld + '</div>';
							self.property_change_table += '</div>';
						});
					}

				});
				self.highlightSelectedRow();
			}

			//Testing
			self.authorization = 'd90b4ca7-f1fa-48de-8f27-0eaf12cfc6df', self.entityType = 'Ad', self.entityID = '1074048485'
			//endTesting		
		}
	]
});
