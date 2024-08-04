public with sharing class FilterDTO {
    @AuraEnabled
    public String Name {get; set;}

    @AuraEnabled
    public Date FromDate {get; set;}

    @AuraEnabled
    public Date ToDate {get; set;}
}