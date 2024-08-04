public with sharing class Header {
    /**
     * Get user info after login
     * @Param email
     * @return user info
     * Time create: 03/08/2024
     */
    @AuraEnabled(cacheable=true)
    public static String GetUserInfo(String email) {
        try {
            UserMovie__c us = [SELECT Id, Email__c FROM UserMovie__c WHERE Email__c = :email AND Status__c = 'Active' LIMIT 1];
            return us.Email__c;
        } catch(Exception error) {
            throw new CustomException(error.getMessage());
        }
    }

    /**
     * Register new user
     * @Param user model
     * Time create: 03/08/2024
     */
    @AuraEnabled
    public static void RegisterUser(UserMovie__c user) {
        try {
            UserMovie__c us = new UserMovie__c();
            us = [SELECT Id, Email__c FROM UserMovie__c WHERE Email__c = :user.Email__c LIMIT 1];
            if(us != null) {
                UserMovie__c addUser = new UserMovie__c(
                    Email__c=user.Email__c,
                    Address__c=user.Address__c
                );
    
                insert addUser;

                RegisterMembership(user.Email__c);
            } else {
                RegisterMembership(user.Email__c);
            }
        } catch (Exception error) {
            throw new CustomException(error.getMessage());
        }
    } 

    /**
     * Register new membership
     * @Param user model
     * Time create: 03/08/2024
     */
    @AuraEnabled
    public static void RegisterMembership(String email) {
        try {
            Membership__c[] mbs = [SELECT Id, Email__c FROM Membership__c WHERE Email__c = :email LIMIT 1];
            if(mbs.size() < 1) {
                Membership__c mbs1 = new Membership__c(Email__c = email);

                insert mbs1;
            } else {
                throw new CustomException('Member already existed: ' + email);
            }
        } catch (Exception error) {
            throw new CustomException(error.getMessage());
        }
    }
}