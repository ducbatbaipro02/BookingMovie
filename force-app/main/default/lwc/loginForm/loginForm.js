import { track } from 'lwc';
import LightningModal from 'lightning/modal';
import formStyles from '@salesforce/resourceUrl/formStyles';
import { loadStyle } from 'lightning/platformResourceLoader';
import GetUserInfo from '@salesforce/apex/Header.GetUserInfo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LoginForm extends LightningModal {
    @track Email;

    connectedCallback() {
        loadStyle(this, formStyles);
    }

    handleCancel() {
        this.close('okay');
    }

    handleChangeValue(event) {
        this.Email = event.target.value;
    }

    login() {
        GetUserInfo({ email: this.Email }).then(result => {
            if (result) {
                this.close({ Email: result });
            } else {
                this.showToast('Login User', 'error', 'No item found!');
            }
        }).catch(() => {
            this.showToast('Login User', 'error', 'Login fail');
        })
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