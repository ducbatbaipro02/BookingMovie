public with sharing class MovieListService {
    /**
     * Get list movie
     * Time create: 03/08/2024
     */
    @AuraEnabled(cacheable=true)
    public static List<Movie__c> GetMovieList(FilterDTO filter) {
        try {
            List<Movie__c> mv = new List<Movie__c>();
            if(filter != null) {
                String filterByName = '%' + filter.Name + '%';
                Date filterByFromDate = Date.valueOf(filter.FromDate);
                Date filterByToDate = Date.valueOf(filter.ToDate);
                String query = 'SELECT Id, Name__c, Description__c, Title__c, Duration__c, (SELECT ShowingDate__c, StartTime__c FROM Showtimes__r) ' +
                                'FROM Movie__c WHERE Name__c like :filterByName ' +
                                'AND Id IN (SELECT Movie__c FROM Showtime__c WHERE ShowingDate__c >= :filterByFromDate AND ShowingDate__c <= :filterByToDate)';

                mv = Database.query(query);
            } else {
                mv = [SELECT Id, Name__c, Description__c, Title__c, Duration__c, (SELECT ShowingDate__c, StartTime__c FROM Showtimes__r) FROM Movie__c];
            }
            
            return mv;
        } catch (Exception error) {
            throw new CustomException(error.getMessage());
        }
    }

    /**
     * Get membership info
     * @Param email
     * @return user membership info
     */
    @AuraEnabled(cacheable=true)
    public static Membership__c GetMemberShipInfo(String email) {
        try {
            String query = 'SELECT Id, Email__c, Address__c, Point__c, Rank__c FROM Membership__c WHERE Email__c = :email LIMIT 1';
            return Database.query(query);
        } catch (Exception error) {
            throw new CustomException(error.getMessage());
        }
    }
}