'use strict';

angular.module('angularTestTwo')
  .controller('mainCtrl', function($scope, offlineDB) {

    $scope.testTitle = "Testing AngularJS + IndexedDB...";
    $scope.updateThis = updateThis;
    $scope.deleteThis = deleteThis;
    $scope.newItem = newItem;
    $scope.clearDB = clearDB;

    offlineDB.openDB(function() {
      offlineDB.fetchData(function(testItems) {
          $scope.testItems = testItems;
          $scope.$apply();
      });
    });

    function clearDB() {
      offlineDB.clearDB(function(returnedArray) {
        if(Object.keys(returnedArray).length == 0) {
            $scope.testItems = [];
            _updateToUI("Cleared");
        }
        else { console.log("Error: Returned array was not empty."); }
      });
    };

    function newItem(item) {
      offlineDB.createItem({text: item}, function(returnedObject) {
        $scope.testItems.push(returnedObject);
        _updateToUI("Added.");
      });
    };

    function updateThis(item) {
      var sanitisedItem = item;
      delete sanitisedItem.$$hashKey;
      offlineDB.updateItem(sanitisedItem, function(returnedItem) {
        $scope.testItems[$scope.testItems.indexOf(item)] = returnedItem;
        _updateToUI("Updated.");
      });
    };

    function deleteThis(item) {
      offlineDB.deleteItem(item, function() {
        $scope.testItems.splice($scope.testItems.indexOf(item), 1);
        _updateToUI("Deleted.");
      })
    };

    /* ---------- Private functions ---------- */
    function _updateToUI(text) {
      $scope.$apply();
      _sendNotification(text);
    }

    function _sendNotification(text) {
      $.notify(text, {position: "bottom right", showDuration: 100, className: "success"});
    };


    /* Synchronise every four seconds. */
/*
    (function timeout() {
      setTimeout(function () {
          refreshItems();
          timeout();
      }, 4000);
    })();

*/

  });
