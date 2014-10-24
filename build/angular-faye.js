(function() {
  angular.module("faye", []);

  angular.module("faye").constant('Faye', window.Faye);

  angular.module("faye").factory("$faye", [
    "$q", "$rootScope", "Faye", function($q, $rootScope, Faye) {
      return function(url, options) {
        var client, scope;
        if (options == null) {
          options = {};
        }
        scope = $rootScope;
        client = new Faye.Client(url, options);
        return {
          client: client,
          publish: function(channel, data) {
            return client.publish(channel, data);
          },
          subscribe: function(channel, callback) {
            return client.subscribe(channel, function(data) {
              return scope.$apply(function() {
                return callback(data);
              });
            });
          },
          get: function(channel) {
            var deferred, sub;
            deferred = $q.defer();
            sub = client.subscribe(channel, function(data) {
              scope.$apply(function() {
                return deferred.resolve(data);
              });
              return sub.cancel();
            });
            return deferred.promise;
          }
        };
      };
    }
  ]);

}).call(this);
