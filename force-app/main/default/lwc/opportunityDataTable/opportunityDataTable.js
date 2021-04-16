import { LightningElement, track, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import ACCOUNTNAME_FIELD from '@salesforce/schema/Opportunity.Account.Name';
import getOpportunities from '@salesforce/apex/OpportunityUtility.getOpportunities';

export default class OpportunityDataTable extends LightningElement {

    @track
    opportunities;
    wiredOpportunities;
    @track draftValues = [];
    columns = [{ label: 'Name', fieldName: 'Name', editable: 'true', type: 'text' },
    { label: 'Account Name', fieldName: ACCOUNTNAME_FIELD, editable: 'true', type: 'text' },
    { label: 'Name', fieldName: 'StageName', editable: 'true', type: 'text' },
    { label: 'Amount', fieldName: 'Amount', editable: 'true', type: 'currency' },
    { label: 'Close Date', fieldName: 'CloseDate', editable: 'true', type: 'Date' },
    ];

    @wire(getOpportunities)
    wiredOpportunity(result) {
        this.wiredOpportunities=result;
        if (result.data) {
            this.opportunities = result.data
        }
        if (result.error) {
            this.opportunities = undefined;
        }
    }

    handleSave(event) {

        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        console.log("recordInputs-->"+JSON.stringify(recordInputs));
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));

        Promise.all(promises).then(opportunities => {
            console.log("inside success for all promises");
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'All Opportunities updated',
                    variant: 'success'
                })
            );
            // Clear all draft values
            this.draftValues = [];

            // Display fresh data in the datatable
             refreshApex(this.wiredOpportunities);
        }).catch(error => {
            console.log("inside error for the promise");
            // Handle error
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error Updaing record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });


    }

}