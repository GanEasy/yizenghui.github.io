angular.module('restServices', ['ngResource']).
factory('Doc', function($resource){
    return $resource(server_api+'d/:dId.json', {}, {
        query: {method:'GET', params:{dId:'0'}, isArray:true}, create:{method:'PUT'}
    });
});