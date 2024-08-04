public with sharing class UserDTO {
    @AuraEnabled
    public String Id {get; set;}

    @AuraEnabled
    public String Email {get; set;}

    @AuraEnabled
    public String Address {get; set;}
}