var app = angular.module("myApp",["firebase"]);
app.controller("myCtrl", function($scope,  $firebaseAuth, $firebaseArray) {
   //$scope.point;
    $scope.providerName = null;
var getRef = function(){
        if($scope.ref == null){
            $scope.ref = new Firebase("https://amber-inferno-2604.firebaseio.com/points");
            $scope.ref.onAuth(function(authData) {
                if (authData) {
                    console.log("Authenticated with uid:", authData.uid);
                    $scope.auth = authData;
                    $scope.points = $firebaseArray($scope.ref);
                    $scope.$apply();
                } else {
                    console.log("Client unauthenticated.")
                }
            });
        }
        return $scope.ref;
    }
$scope.auth = null;
$scope.ref = null;
getRef();

$scope.login =function() {
    $scope.providerName = 'google';
        var provider = 'google';
        var scope = {scope:'email'};
        var auth = $firebaseAuth(getRef());
        auth.$authWithOAuthPopup(provider, scope, function(error, authData){
            if (error) {
                // an error occurred while attempting login
                alert("error: " + error);
            }
        });
    };
    $scope.logout = function(){
        $scope.auth = null;
        getRef().unauth();
    }
    $scope.loginFb =function() {
        $scope.providerName = 'facebook';
        var provider = 'facebook';
        var scope = {scope:'email'};
        var auth = $firebaseAuth(getRef());
        auth.$authWithOAuthPopup(provider, scope, function(error, authData){
            if (error) {
                // an error occurred while attempting login
                alert("error: " + error);
            }
        });
    };

    $scope.addPoints = function() {

        var user = $scope.auth.uid;

        $scope.score = parseInt(document.getElementById('nca').innerHTML);
           console.log($scope.score);
        //update record
        var item = $scope.points.$getRecord(user);
        if(item != null)
        {
        var pts = parseInt(item.point) + $scope.score;
        item.point = pts;
        $scope.points.$save(item).then(function() {
      // data has been saved to our database
           });
        }
        else
        {
           var usersRef = $scope.ref.child(user);
           usersRef.set({
           user: $scope.auth.google.displayName,
           point:  $scope.score
           });
        }
    };

});
