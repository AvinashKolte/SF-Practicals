import { LightningElement, track,wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import ID_FIELD from '@salesforce/schema/Contact.Id';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import ACCOUNTID_FIELD from '@salesforce/schema/Contact.AccountId';
import PRIMARYCONTACT_FIELD from '@salesforce/schema/Contact.primary_contact__c';

import getAccountWithContacts from '@salesforce/apex/AccountContactDetail.getAccountWithContacts';
export default class AccountContactDetails extends LightningElement {
    @track
    accounts;
  
    @track selectedAccount;
    
    columns = [{ label: 'Name', fieldName: 'Name', editable: 'true' }, { label: 'Primary Contact', fieldName: 'primary_contact__c', editable: 'true', type: 'Boolean' }];
    

    draftValues=[];
    connectedCallback() {
       this.loadAccountWithContacts();
    }
    
    

    handleSave(event)
    {
        //let row={Id:event.detail.draftValues[0].Id,AccountId:event.detail.draftValues[0].AccountId,primary_contact__c:event.detail.draftValues[0].primary_contact__c,Name:event.detail.draftValues[0].Name};
        console.log(event.detail.draftValues);
        this.updateRow(event.detail.draftValues[0]);
    }
    updateRow(row) {
        console.log("row:");
        console.log(row);
        console.log("row.primary_contact__c :"+row.primary_contact__c );
        console.log("row.Name:"+row.Name);
        console.log("row");
        const acc = this.accounts.filter(ac => {
            return this.selectedAccount.Id == ac.Id;
        })
        console.log("account for selected contact");
        console.log(acc);
        if (acc && acc.length > 0) {
            let isValid = true;
            for (let c of acc[0].Contacts) {
                console.log("row.Id"+row.Id);
                console.log("c.Id:"+c.Id);
                console.log("row.Id.localeCompare(c.Id) "+row.Id.localeCompare(c.Id));
                console.log("Boolean(row.primary_contact__c) == true:"+(row.primary_contact__c == 'true'));
                console.log("c.primary_contact__c == true:"+(c.primary_contact__c == true));
                if (row.Id.localeCompare(c.Id) !=0  && row.primary_contact__c == 'true' && c.primary_contact__c == true) {
                    isValid = false;
                }

            }
            console.log(isValid);
            if (isValid) {
                const fields = {};
                fields[ID_FIELD.fieldApiName] = row.Id;
                fields[NAME_FIELD.fieldApiName] = row.Name;
                fields[PRIMARYCONTACT_FIELD.fieldApiName] = (row.primary_contact__c=='true') ? true:false ;
                
                /*const recordInput = this.draftValues.slice().map(draft => {
                    const fields = Object.assign({}, draft);
                    return { fields };
                });*/
                const recordInput = { fields };
                console.log("recordInput-->");
                console.log(recordInput);
                console.log("<--recordInput");
                updateRecord(recordInput).then(result => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact updated',
                            variant: 'success'
                        })
                    );
                    // Display fresh data in the form
                    return refreshApex(this.accounts);
                })
                    .catch(error => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Error Updaing record',
                                message: error.body.message,
                                variant: 'error'
                            })
                        );
                    })
            }
            else
            {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'There can be only one Primary Contact Per Account',
                        variant: 'error'
                    })
                );
            }
        }
    }

    loadAccountWithContacts() {
        getAccountWithContacts()
            .then(result => {
                this.accounts = result;
                console.log(result);
            })
            .catch(error => {
                console.error(error);
            })
    }

    get checkSelectedAccount() {
        return (this.selectedAccount && this.selectedAccount.Contacts) ? true : false;
    }
    handleClick(event) {
        const selectedId = event.target.dataset.id;
        console.log("selectedId-->" + selectedId);
        const selectedAcct = this.accounts.filter(acc => {
            return acc.Id == selectedId;
        })
        this.selectedAccount = (selectedAcct) ? selectedAcct[0] : undefined;
        console.log("this.selectedAccount-->");
        console.log(this.selectedAccount);
        console.log("<--this.selectedAccount");
    }
}