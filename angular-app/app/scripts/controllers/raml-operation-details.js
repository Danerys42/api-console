angular.module('ramlConsoleApp')
    .controller('ramlOperationDetails', function ($scope, eventService) {
        $scope.parseTypeName = function (value) {
            var split = value.split('/');

            if (split.length >= 2) {
                return split[1];
            } else {
                return split;
            }
        };

        $scope.hasDescription = function (value) {
            return !(typeof value !== 'undefined' && value !== '');
        };

        $scope.initTabs = function () {
            if ($scope.tabs) {
                return;
            }

            $scope.tabs = [];

            if ($scope.consoleSettings && $scope.consoleSettings.displayTryIt){
                $scope.tabs.push({
                    name: 'try-it',
                    displayName: 'Try It',
                    view: 'views/raml-operation-details-try-it.tmpl.html',
                    show: function () {
                        return true;
                    }
                });
            }

            $scope.tabs.push({
                name: 'parameters',
                displayName: 'Parameters',
                view: 'views/raml-operation-details-parameters.tmpl.html',
                show: function () {
                    var urlParams = ($scope.urlParams || []).filter(function (p) { return p.editable; });
                    return ($scope.operation.queryParameters && $scope.operation.queryParameters.length) || urlParams.length;
                }
            });

            $scope.tabs.push({
                name: 'requests',
                displayName: 'Request',
                view: 'views/raml-operation-details-request.tmpl.html',
                show: function () {
                    return typeof $scope.operation.request !== 'undefined';
                }
            });

            $scope.tabs.push({
                name: 'response',
                displayName: 'Response',
                view: 'views/raml-operation-details-response.tmpl.html',
                show: function () {
                    return typeof $scope.operation.responses !== 'undefined';
                }
            });

            $scope.initSelectedTab();
        };

        $scope.initSelectedTab = function () {
            $scope.tabName = null;
            $scope.tabs.forEach(function (tab) {
                if (!$scope.tabName && tab.show()) {
                    $scope.tabName = tab.name;
                }
            });
        };

        $scope.$on('event:raml-method-changed', function () {
            $scope.initSelectedTab();
            if ($scope.operation.supportedTypes && $scope.operation.supportedTypes.length) {
                eventService.broadcast('event:raml-body-type-changed', $scope.operation.supportedTypes[0]);
            } else {
                eventService.broadcast('event:raml-body-type-changed', 'application/json');
            }
        });

        $scope.isTabActive = function (tabName) {
            return tabName === $scope.tabName;
        };

        $scope.isTypeActive = function (mediaType) {
            return mediaType === $scope.contentType;
        };

        $scope.changeTab = function (tabName) {
            $scope.tabName = tabName;
        };

        $scope.requestFilter = function (el) {
            return el.method === $scope.operation.method && typeof el.body !== 'undefined' && typeof el.body[$scope.bodyType.name] !== 'undefined';
        };

        $scope.changeBodyType = function (mediaType) {
            $scope.contentType = mediaType;
            eventService.broadcast('event:raml-body-type-changed', mediaType);
        };

        $scope.responseFilter = function (el) {
            return el.name === $scope.operation.name && typeof el.responses !== 'undefined';
        };

        $scope.initTabs();
    });