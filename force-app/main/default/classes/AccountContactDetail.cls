public with sharing class AccountContactDetail {
  

    @AuraEnabled
    public static List<Account> getAccountWithContacts(){
        try {
            
            List<Account> accountWithContacts=[select id,Name,(select id,Name,primary_contact__c,AccountId from Contacts) from Account limit 50];

            SObjectAccessDecision decision=Security.stripInaccessible(AccessType.READABLE,accountWithContacts,true);

            return decision.getRecords();

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
