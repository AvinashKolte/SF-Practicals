@RestResource(urlMapping='/accountDetails')
global with sharing class AccountDetails {

    @HttpPost
    global static Response getAccounts(String createdAfter)
    {
        try{
        List<Account> accList= [select id,Name,AccountSource,CreatedDate,Description,BillingAddress,OwnerId from Account where CreatedDate>: Date.valueOf(String.escapeSingleQuotes(createdAfter)) WITH SECURITY_ENFORCED];
        
        Response resp=new Response();
        resp.success=true;
        resp.msg='successfully retrieved';
        resp.data=accList;
        return resp;
        }
        catch(Exception ex)
        {

        Response resp=new Response();
        resp.success=false;
        resp.msg=ex.getMessage();
        resp.data=null;
        return resp;
        }
    }

    global class Response{

        Boolean success;
        String msg;
        List<SObject> data;
    }
    
}