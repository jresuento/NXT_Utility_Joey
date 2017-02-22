//'use strict';

angular.
module('history').
component('historyView', {
	templateUrl: 'history/history.template.html',
	controller: ['$rootScope', '$resource', '$cookies', 'Utils',
		function HistoryController($rootScope, $resource, $cookies, utils) {

			var self = this;
			self.utils = utils;
			self.entitiesTypes = ($resource('config/entities.json')).get();
			self.isShowLogDetails = false;
			self.selectedHistoryID = null;
			self.selectedHistoryDetails = {};
			self.entityHistoryResult = new Array;	

			self.authorization = (typeof $rootScope.sessionId != 'undefined') ? $rootScope.sessionId : ((typeof $cookies.getObject('sessionId') != 'undefined') ? $cookies.getObject('sessionId') : '');

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
				var propertyChanges = new Array;
				angular.forEach(self.entityHistoryResult, function(value) {
					if(value.id == self.selectedHistoryID) self.selectedHistoryDetails = value;
				});

				self.isShowLogDetails = true;
				self.property_change_table = '<div class=\'row property-change-table-row-header\'>';
				self.property_change_table += '<div class=\'col-md-2\'>ParentField</div>';
				self.property_change_table += '<div class=\'col-md-2\'>Field</div>';
				self.property_change_table += '<div class=\'col-md-2\'>ContainerID</div>';
				self.property_change_table += '<div class=\'col-md-3\'>New Value</div>';
				self.property_change_table += '<div class=\'col-md-3\'>Old Value</div>';
				self.property_change_table += '</div>';

				function getAllPropertyChanges(a, b){
					var d, e = arguments;
					b.push({
						'parentField' : a.parentField,
						'field' : a.field,
						'containerId': a.containerId,
						'valueNew' : typeof a.valueNew == 'undefined' ? '' : a.valueNew,
						'valueOld' : typeof a.valueOld == 'undefined' ? '' : a.valueOld
					});
					d = typeof a.propertyChanges == 'object' ? a.propertyChanges : typeof a.objectPropertyChangeList == 'object' ? a.objectPropertyChangeList : null					
					!!d && angular.forEach(d, function(c) {
						switch(c.type){
							case 'CollectionItemPropertyChange':
							case 'ObjectPropertyChange':
							case 'CollectionPropertyChange':
								e.callee(c, b);
								break;
							case 'TerminalPropertyChange':
								b.push({
									'parentField' : c.parentField,
									'field' : c.field,
									'containerId': c.containerId,
									'valueNew' : c.valueNew,
									'valueOld' : c.valueOld
								});
								break;
							default:
								window.alert('Property unhandled. Property name: ' + c.type)
						}
					});
				}

				if(typeof self.selectedHistoryDetails.originJsonValue.propertyChange === 'undefined'){
					self.property_change_table += '<div class=\'row\'>';
					self.property_change_table += '<div class=\'col-md-12\'>No property changes to show.</div>';
					self.property_change_table += '</div>';
				} else angular.forEach(self.selectedHistoryDetails.originJsonValue.propertyChange.propertyChanges, function(v) {
					propertyChanges = new Array;
					getAllPropertyChanges(v, propertyChanges);
					angular.forEach(propertyChanges, function(v2) {							
						self.property_change_table += '<div class=\'row\'>';
						self.property_change_table += '<div title=\'' + v2.parentField + '\' class=\'col-md-2\'>' + v2.parentField + '</div>';
						self.property_change_table += '<div title=\'' + v2.field + '\' class=\'col-md-2\'>' + v2.field + '</div>';
						self.property_change_table += '<div title=\'' + v2.containerId + '\' class=\'col-md-2\'>' + v2.containerId + '</div>';
						self.property_change_table += '<div title=\'' + v2.valueNew + '\' class=\'col-md-3\'>' + v2.valueNew + '</div>';
						self.property_change_table += '<div title=\'' + v2.valueOld + '\' class=\'col-md-3\'>' + v2.valueOld + '</div>';
						self.property_change_table += '</div>';
					});
				});			
				self.highlightSelectedRow();
			}

			//console.log('typeof $rootScope.sessionId', typeof $rootScope.sessionId)
			//Testing
			//self.authorization = '8ab713cf-07cb-4f1a-900f-c540b421cc57', self.entityType = 'DeliveryGroup', self.entityID = '1073821000'
			//endTesting		
		}
	]
});
