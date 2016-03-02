'use strict';

/**
 * @ngdoc directive
 * @name angularApp.directive:commentBox
 * @description
 * # commentBox
 */
angular.module('commentBox', ['commentList', 'commentForm'])
  .directive('commentBox', function ($http) {
    return {
      template: '<div class="commentBox">' +
                  '<h1>Comments</h1>' +
                  '<comment-list comments="data"></comment-list>' +
                  '<comment-form></comment-form>' +
                '</div>',
      restrict: 'E',
      scope: {
        url: '@',
        pollInterval: '@'
      },
      link: function postLink(scope, element, attrs) {
        var loadCommentsFromServer = function () {
          $http.get(scope.url)
            .success(function(data, status, headers, config){
              scope.data = data;
              console.log('data',data);
              angular.forEach(scope.data,function(item,index){
                if(item.date != undefined){
                  var  milli = new Date(item.date).getTime();
                  console.log("date in milli",milli);
                  scope.data[index].date = milli;

                }

              });

            })
            .error(function(data, status, headers, config){
              console.log(status);
            });
        };
        var handleCommentSubmit = function (event, data) {
          var comment = data;
          scope.data.concat([comment]);
          $http.post(scope.url, comment)
            .success(function(data, status, headers, config){
              console.log('success')
            })
            .error(function(data, status, headers, config){
              console.log(status);
            });
        };
        loadCommentsFromServer();
        setInterval(loadCommentsFromServer, scope.pollInterval);
        scope.$on('submitted', handleCommentSubmit);
      }
  }});
