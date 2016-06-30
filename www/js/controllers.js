angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      {title: 'Reggae', id: 1},
      {title: 'Chill', id: 2},
      {title: 'Dubstep', id: 3},
      {title: 'Indie', id: 4},
      {title: 'Rap', id: 5},
      {title: 'Cowbell', id: 6}
    ];
  })

  .controller('HomeCtrl', function ($scope, $interval, $filter, $cordovaGeolocation, $cordovaInsomnia, $cordovaToast, $cordovaDeviceMotion, $cordovaDeviceOrientation) {

    $cordovaInsomnia.keepAwake();

    $scope.loc = '';
    $filter('date')(1457614582602, 'HH:mm:ss');
    var bestLocation;
    var positionCnt = 0;
    var timer;

    function getBestLocation(location) {

      if (15 === positionCnt) {
        //bestLocation = {};
        $interval.cancel(timer);
        positionCnt = 0;
        var index = 0;
        for (var x = 0; x < location.length; x++) {
          if (location[x].coords.accuracy != null && location[index].coords.accuracy > location[x].coords.accuracy) {
            index = x;
          }
        }
        bestLocation = location[index];
        if (bestLocation.coords.speed != null || bestLocation.coords.altitude != null) {
          $scope.bestLocation = bestLocation;
        }
      }
    }




    $(function () {
      var timeBoom = new Date();
      Highcharts.setOptions({
        global: {
          useUTC: false
        }
      });
      $('#container').highcharts({
        chart: {
          zoomType: 'xy',
          animation: false,
          events: {
            load: function () {
              // set up the updating of the chart each second
              var series0 = this.series[0];
              var series1 = this.series[1];
              var location = [];
              $scope.myTimer = $interval(function () {
                $cordovaGeolocation
                  .getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
                  .then(function (position) {
                    if (position.coords.speed != null || position.coords.altitude != null) {
                      location.push(position);

                      if (3 === location.length) {
                        var index = 0;
                        for (var x = 0; x < location.length; x++) {
                          if (location[x].coords.accuracy != null && location[index].coords.accuracy > location[x].coords.accuracy) {
                            index = x;
                          }
                        }
                        bestLocation = location[index];
                        location = [];

                        var y1 = bestLocation.coords.altitude;
                        var y2 = bestLocation.coords.speed * 3.6;
                        //var y1 = bestLocation.coords.longitude;
                        //var y2 = bestLocation.coords.latitude;

                        var x = (new Date()).getTime();
                        series0.addPoint([x, y1], true, true);
                        series1.addPoint([x, y2], true, true);
                      }
                      //$scope.loc = $scope.loc + '==============' + positionCnt + '==================' + '<br>' +
                      //  'Latitude: ' + position.coords.latitude + '<br>' +
                      //  'Longitude: ' + position.coords.longitude + '<br>' +
                      //  'Altitude: ' + position.coords.altitude + '<br>' +
                      //  'Accuracy: ' + position.coords.accuracy + '<br>' +
                      //  'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br>' +
                      //  'Heading: ' + position.coords.heading + '<br>' +
                      //  'Speed: ' + position.coords.speed + '<br>' +
                      //  'Timestamp: ' + position.timestamp + '<br>';
                    }


                  }, function (error) {

                    //$cordovaToast.showShortTop("定位中，请打开GPS并移至开阔地带");
                    //$scope.loc = $scope.loc + '===============' + positionCnt + '=================' + '<br>' +
                    //  'code: ' + error.code + '<br>' +
                    //  'message: ' + error.message + '<br>';
                  })
              }, 200);


              //setInterval(function () {
              //  var x = (new Date()).getTime(), // current time
              //    y = Math.random();
              //
              //
              //  series0.addPoint([x, y * Math.random() + Math.random()], true, true);
              //  series1.addPoint([x, y], true, true);
              //}, 500);
            }
          }
        },
        rangeSelector: {
          buttons: [],
          inputEnabled: false
        },
        title: {
          text: '飞行记录 - GPS定位数据'
        },
        exporting: {
          enabled: false
        },
        xAxis: {
          gridLineWidth: 1,
          type: 'datetime',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%e. %b',
            week: '%e. %b',
            month: '%b \'%y',
            year: '%Y'
          }
        },
        yAxis: [{ // Primary yAxis
          minorTickInterval: 'auto',
          lineColor: '#000',
          lineWidth: 1,
          tickWidth: 1,
          tickColor: '#000',
          title: {
            text: 'GPS速度',
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          },
          labels: {
            format: '{value}KM/h',
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          }
        }, { // Secondary yAxis
          minorTickInterval: 'auto',
          lineColor: '#000',
          lineWidth: 1,
          tickWidth: 1,
          tickColor: '#000',
          title: {
            text: '海拔高度',
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          labels: {
            format: '{value}米',
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          opposite: true
        }],
        tooltip: {
          shared: true
        },
        //legend: {
        //  layout: 'vertical',
        //  align: 'left',
        //  x: 120,
        //  verticalAlign: 'top',
        //  y: 100,
        //  floating: true,
        //  backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        //},
        series: [{
          name: '高度',
          type: 'areaspline',
          yAxis: 1,
          data: (function () {
            // generate an array of random data
            var data = [];
            for (i = -600; i < 0; i++) {
              data.push({x: timeBoom.getTime() + i * 1000, y: 450});
            }
            return data;
          })(),
          tooltip: {
            valueSuffix: '米'
          }

        }, {
          name: '速度',
          type: 'spline',
          data: (function () {
            // generate an array of random data
            var data = [];
            for (i = -600; i < 0; i++) {
              data.push({x: timeBoom.getTime() + i * 1000, y: 0});
            }
            return data;
          })(),
          tooltip: {
            valueSuffix: 'KM/h'
          }
        }]
      });
    });

  })
  .controller('PlaylistCtrl', function ($scope, $stateParams) {

  });
