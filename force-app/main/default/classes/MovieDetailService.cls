public with sharing class MovieDetailService {
    @AuraEnabled(cacheable=true)
    public static Movie__c GetMovieDetail(String Id) {
        try {
            Movie__c mv = [SELECT Id, Name__c, Description__c, Title__c, Duration__c, Genre__c, (SELECT ShowingDate__c, StartTime__c FROM Showtimes__r) FROM Movie__c WHERE Id = :Id];
            return mv;
        } catch (Exception error) {
            throw new CustomException(error.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Showtime__c> GetListShowtime(String Id) {
        try {
            List<Showtime__c> showtime = [SELECT Id, StartTime__c, (select id, Type__c from AvaiableSeats__r)  FROM showtime__c WHERE movie__c = :Id];

            return showtime;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}