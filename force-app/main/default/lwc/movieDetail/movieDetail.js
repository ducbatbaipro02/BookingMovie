import { LightningElement, track, wire, api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import movieStyles from '@salesforce/resourceUrl/movieStyles';
import imgSource from '@salesforce/resourceUrl/defaultFilmImg';
import generateData from './generateData';
import { CurrentPageReference } from 'lightning/navigation';
import GetMovieDetail from '@salesforce/apex/MovieDetailService.GetMovieDetail';
import GetListShowtime from '@salesforce/apex/MovieDetailService.GetListShowtime';

const columns = [
    { label: 'Show Time', fieldName: 'formattedTimestamp', type: 'text' },
    { label: 'Normal', fieldName: 'Normal', type: 'text' },
    { label: 'VIP', fieldName: 'VIP', type: 'text' },
    { label: 'VVIP', fieldName: 'VVIP', type: 'text' },
    { label: 'Couple', fieldName: 'Couple', type: 'text' }
];

export default class MovieDetail extends LightningElement {
    @track movieDetail = {
        Name__c: '',
        Description__c: '',
        Genre__c: '',
        Duration__c: ''
    };
    @track showtimeList = [];
    @track selectedRows = [];

    imgFilmDefault = imgSource;
    data = [];
    columns = columns;

    connectedCallback() {
        loadStyle(this, movieStyles);

        const data = generateData({ amountOfRecords: 10 });
        this.data = data;
    }

    @wire(CurrentPageReference)
    wireGetMovieDetail(currentPageReference) {
        this.urlId = currentPageReference.state?.id;
        const id = 'a0EdL000005CBxjUAG';
        GetMovieDetail({Id: id}).then(result => {
            this.movieDetail = result;
            console.log(this.movieDetail);
        }).catch(() => {

        })
    }

    @wire(CurrentPageReference)
    wireGetListShowtime(currentPageReference) {
        this.urlId = currentPageReference.state?.id;
        const id = 'a0EdL000005CBxjUAG';
        GetListShowtime({Id: id}).then(result => {
            this.showtimeList = result;
        }).catch(() => {

        })
    }

    get formattedData() {
        return this.showtimeList.map(item => ({
            ...item,
            formattedTimestamp: this.formatDateTime(item.StartTime__c)
        }))
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString();
    }

    handleRowSelection(event) {
        const selectedRow = event.detail.selectedRows || [];
        if(selectedRow.length > 0) {
            this.selectedRows = [selectedRow[0]];
        } else {
            this.selectedRows = [];
        }
    }
}