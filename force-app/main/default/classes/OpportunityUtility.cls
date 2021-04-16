public with sharing class OpportunityUtility {
    
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(){
        try {

            return [Select id,Name,Account.Name,StageName,Amount,CloseDate from Opportunity WITH_SECURITY_ENFORCED limit 50];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
