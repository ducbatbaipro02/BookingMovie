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

    handleCancel() {
        this.close('okay');
    }

    handleChangeValue(event) {
        const { name, value } = event.target;
        if (name === 'email') {
            this.Email = value;
        } else {
            this.Address = value;
        }
    }

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

    showToast(title, type, message) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: type
        });
        this.dispatchEvent(event);
    }
}