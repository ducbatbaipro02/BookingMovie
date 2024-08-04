import { LightningElement, wire, track, api } from 'lwc';
import RegisterForm from 'c/registerForm';
import LoginForm from 'c/loginForm';
import { loadStyle } from 'lightning/platformResourceLoader';
import movieStyles from '@salesforce/resourceUrl/movieStyles';
import imgSource from '@salesforce/resourceUrl/defaultFilmImg';
import GetMovieList from '@salesforce/apex/MovieListService.GetMovieList';
import GetMemberShipInfo from '@salesforce/apex/MovieListService.GetMemberShipInfo';

export default class MovieList extends LightningElement {
    imgFilmDefault = imgSource;
    @track movies = [];
    @api filter = {
        Name: '',
        FromDate: '2024-08-04',
        ToDate: '2024-08-04'
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

    handleChangeValue(event) {
        const { name, value } = event.target;

        if (name === 'name') {
            this.filter.Name = value;
        } else if (name === 'fromdate') {
            this.filter.FromDate = value;
        } else {
            this.filter.ToDate = value;
        }
    }

    filterListMovie() {
        GetMovieList({ filter: this.filter }).then(result => {
            this.movies = result;
        }).catch(() => {

        });
    }

    getMembershipInfo(email) {
        GetMemberShipInfo({ email: email }).then(result => {
            this.userInfo = JSON.parse(JSON.stringify(result));
        }).catch(() => {

        });
    }

    async handleRegisterClick() {
        const result = await RegisterForm.open({
            label: 'Register Form',
            size: 'small'
        });
    }

    async handleLoginClick() {
        const result = await LoginForm.open({
            label: 'Login Form',
            size: 'small'
        });

        console.log(result);

        if (result) {
            this.getMembershipInfo(result.Email);
        }
    }

    handleLogoutClick() {
        this.userInfo = {
            Id: '',
            Email: ''
        }
    }

    handleSearchClick() {
        this.filterListMovie();
    }
}