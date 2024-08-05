import { LightningElement, wire, track, api } from 'lwc';
import RegisterForm from 'c/registerForm';
import LoginForm from 'c/loginForm';
import { loadStyle } from 'lightning/platformResourceLoader';
import movieStyles from '@salesforce/resourceUrl/movieStyles';
import imgSource from '@salesforce/resourceUrl/defaultFilmImg';
import GetMovieList from '@salesforce/apex/MovieListService.GetMovieList';
import GetMemberShipInfo from '@salesforce/apex/MovieListService.GetMemberShipInfo';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MovieList extends LightningElement {
    imgFilmDefault = imgSource;
    @track movies = [];
    @api filter = {
        Name: '',
        FromDate: new Date().toLocaleDateString('en-CA'),
        ToDate: new Date().toLocaleDateString('en-CA')
    };
    @api userInfo = {
        Id: '',
        Email: 'N/A',
        Address: 'N/A',
        Rank: 0
    };

    connectedCallback() {
        loadStyle(this, movieStyles);
    }

    /**
     * Get movie list
     * @return list movie
     * Time create: 03/08/2024
     */
    @wire(GetMovieList)
    wiredMovies({ error, data }) {
        if (data) {
            this.movies = data;
        }
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
     * Filter list movie
     * Time create: 05/08/2024
     */
    filterListMovie() {
        GetMovieList({ filter: this.filter }).then(result => {
            this.movies = result;
        }).catch(() => {
            console.log('Invalid request - get list movies');
        });
    }

    /**
     * Get membership info
     * @param {*} email 
     * Time create: 05/08/2024
     */
    getMembershipInfo(email) {
        GetMemberShipInfo({ email: email }).then(result => {
            this.userInfo = JSON.parse(JSON.stringify(result));
        }).catch(() => {
            console.log('Invalid request - get membership');
        });
    }

    /**
     * Click on register button
     * Time create: 05/08/2024
     */
    async handleRegisterClick() {
        await RegisterForm.open({
            label: 'Register Form',
            size: 'small'
        });
    }

    /**
     * Click on login button
     * Time create: 05/08/2024
     */
    async handleLoginClick() {
        const result = await LoginForm.open({
            label: 'Login Form',
            size: 'small'
        });

        if (result) {
            this.getMembershipInfo(result.Email);
        }
    }

    /**
     * Click on logout button
     * Time create: 05/08/2024
     */
    handleLogoutClick() {
        this.userInfo = {
            Id: '',
            Email: ''
        }
    }

    /**
     * Click on search button
     * Time create: 05/08/2024
     */
    handleSearchClick() {
        if (this.filter.Name && this.filter.Name.length < 3) {
            this.showToast('Filter movie', 'error', 'Movie type must have at least 3 characters!');
        } else {
            this.filterListMovie();
        }
    }

    handleRedirect() {
        // Replace '001XXXXXXXXXXXXXXX' with your actual record ID
        const recordId = 'a0EdL000005CBxjUAG';

        // Navigate to the record page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'MovieDetail', // Replace with your object's API name
                actionName: 'view' // You can use 'edit' or 'view' based on your requirement
            }
        });
    }

    /**
     * Clear filter
     * Time create: 05/08/2024
     */
    handleClearClick() {
        this.filter = {
            Name: '',
            FromDate: new Date().toLocaleDateString('en-CA'),
            ToDate: new Date().toLocaleDateString('en-CA')
        };

        this.filterListMovie();
    }

    /**
     * Show toast message
     * @param {*} title 
     * @param {*} type (success, error, info)
     * @param {*} message 
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