'use strict';

angular.module('core.logparser').
factory('LogParser', ['Utils', 
function(Utils) {
	class LogParser{
		constructor(){
			this.entityHistory = null
			this.logCount = null;
		}
		constructEntityHistory(res){
			this.logCount = 0;
			this.entityHistory = {}
			for(var i in res.result){				
				this.parseLog(res.result[i])
			}			
		}
		parseLog(log, propertyChange){

			if(propertyChange && propertyChange.type == 'CollectionItemPropertyChange'){				
				try{
					delete this.entityHistory[propertyChange.parentLogID]
				} catch(e){}
			}

			var logid = Utils.format('{0}_{1}', this.logCount, log.id)
			this.logCount++;	
			this.entityHistory[logid] = {}
			this.entityHistory[logid]['id'] = log.id
			this.entityHistory[logid]['type'] = log.type
			this.entityHistory[logid]['changedDate'] = log.changedDate
			this.entityHistory[logid]['typeOfEntity'] = propertyChange ? (Utils.format('{0}.{1}', propertyChange.parentField, propertyChange.field)) : log.typeOfEntity
			this.entityHistory[logid]['entityId'] = propertyChange ? (propertyChange.containerId) : log.entityId
			this.entityHistory[logid]['operationType'] = log.operationType
			this.entityHistory[logid]['DateTime'] = Utils.msToDateTime(log.changedDate)
			this.entityHistory[logid]['performedBy'] = Utils.format('{0} ({1}) | {2} ({3})', log.changerUserName, log.changerUserId, log.changerAccountName, log.changerAccountId)	
			this.entityHistory[logid]['propertyChanges'] = new Array

			if(log.type == 'EntityOperation'){
				this.entityHistory[logid]['propertyChanges'].push({
					'innerMessage' : log.innerMessage
				})
			}

			if(log.type == 'EntityChange'){
				propertyChange = propertyChange || log.propertyChange
				if(propertyChange.type == 'ObjectPropertyChange' || propertyChange.type == 'CollectionPropertyChange' || propertyChange.type == 'CollectionItemPropertyChange'){					
					let propertyChanges = propertyChange.propertyChanges || propertyChange.objectPropertyChangeList
					for(let i in propertyChanges){
						let a = propertyChanges[i];
						a.type == 'TerminalPropertyChange' && (this.entityHistory[logid]['entityId'] = a.containerId, this.entityHistory[logid]['propertyChanges'].push(a));
						(a.type == 'ObjectPropertyChange' || a.type == 'CollectionPropertyChange' || a.type == 'CollectionItemPropertyChange') && (a.parentLogID = logid, this.parseLog(log, a))
					}
				}
			}
		}
	}
	return new LogParser;
}]);