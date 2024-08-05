import LightningModal from 'lightning/modal';
import { api, track } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import formStyles from '@salesforce/resourceUrl/formStyles';
import RegisterUser from '@salesforce/apex/Header.RegisterUser';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RegisterForm extends LightningModal {
    @track Email;
    @track Address;
    @api content;
    email;

    connectedCallback() {
        loadStyle(this, formStyles);
    }

    /**
     * Close popup
     * Time create: 05/08/2024
     */
    handleCancel() {
        this.close('okay');
    }

    /**
     * Get value input
     * @param {*} event
     * Time create: 05/08/2024 
     */
    handleChangeValue(event) {
        const { name, value } = event.target;
        this.filter[name] = value;
    }

    /**
     * Register new user
     * Time create: 05/08/2024
     */
    registerUser() {
        const user = {
            Email__c: this.Email,
            Address__c: this.Address
        };

        RegisterUser({ user: user }).then(result => {
            this.showToast('Register User', 'success', 'Register account success');
            this.close('okay');
        }).catch(() => {
            this.showToast('Register User', 'error', 'Register account fail');
        });
    }

    /**
     * Show toast message
     * @param {*} title 
     * @param {*} type (success, error, info)
     * @param {*} message 
     * Time create: 05/08/2024
     */
    showToast(title, type, message) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: type
        });
        this.dispatchEvent(event);
    }
}