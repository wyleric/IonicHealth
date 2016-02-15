// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova', 'starter.controllers', 'starter.services','ionic-datepicker'])

    .run(function ($ionicPlatform,$cordovaNetwork,$location,$cordovaToast,$ionicHistory,$cordovaKeyboard,$rootScope,$ionicLoading,$ionicPopup,$cordovaAppVersion,ApiEndpoint,$http) {
        $ionicPlatform.ready(function () {


            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            // 设备准备完后 隐藏启动动画
            if(navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
            if (window.cordova && window.cordova.InAppBrowser) {
                window.open = window.cordova.InAppBrowser.open;
            }

            //物理返回按钮控制&双击退出应用
            $ionicPlatform.registerBackButtonAction(function (e) {
                //判断处于哪个页面时双击退出
                if ($location.path() == '/tab/xueya' || $location.path() == '/tab/zixun' || $location.path() == '/tab/user'|| $location.path() == '/tab/shequ') {
                    if ($rootScope.backButtonPressedOnceToExit) {
                        ionic.Platform.exitApp();
                    } else {
                        $rootScope.backButtonPressedOnceToExit = true;
                        $cordovaToast.showShortBottom('再按一次退出系统');
                        setTimeout(function () {
                            $rootScope.backButtonPressedOnceToExit = false;
                        }, 2000);
                    }
                }else if ($ionicHistory.backView()) {
                    if ($cordovaKeyboard.isVisible()) {
                        $cordovaKeyboard.close();
                    } else {
                        $ionicHistory.goBack();
                    }
                }
                else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortBottom('再按一次退出系统');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
                e.preventDefault();
                return false;
            }, 101);
            //判断网络状态
            document.addEventListener("deviceready", function () {

                //var type = $cordovaNetwork.getNetwork()
                //
                //var isOnline = $cordovaNetwork.isOnline()
                //
                //var isOffline = $cordovaNetwork.isOffline()

                // listen for Online event
                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    var onlineState = networkState;
                })

                // listen for Offline event
                $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    var offlineState = networkState;
                    //提醒用户的网络异常
                    $ionicLoading.show({
                        template: '网络异常，不能连接到服务器！'
                    });
                })

            }, false);

            //检查更新
            checkUpdate();

            function checkUpdate() {
                cordova.getAppVersion.getVersionNumber().then(function(version){
                    $http.jsonp(ApiEndpoint.url+'user/update?version=' + version +'&callback=JSON_CALLBACK').success(function(data){
                        if (data.code != 0) {
                            if (version != data.version) {
                                showUpdateConfirm(data.message, data.url);
                            }
                        }
                    }).error(function(error){
                        alert("网络连接有误");
                    })
                })
            };

            function showUpdateConfirm(desc, url) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '有新版本了！是否要升级？',
                    template: desc,
                    cancelText: '下一次',
                    okText: '确定'
                });
                var url = url;
                confirmPopup.then(function(res) {
                    if (res) {
                        window.open(url, '_system', 'location=yes');
                    };

                });
            }
        });

    })

    .config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

        //andoird 底部出现在了上部 解决方案
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            //底部导航
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                controller:'publicCtrl'
            })
            .state('public', {
                url: "/public",
                abstract: true,
                templateUrl: "templates/public.html"
            })

            // 血压
            .state('tab.xueya', {
                url: '/xueya',
                cache: false,
                views: {
                    'tab-xueya': {
                        templateUrl: 'templates/tab-index.html',
                        controller:'xueYaCtrl'
                    }
                }
            })
            .state('tab.report', {
                url: '/report',
                cache: false,
                views: {
                    'tab-xueya': {
                        templateUrl: 'templates/home/tab-report.html',
                        controller:'xueYaCtrl'
                    }
                }
            })
            .state('tab.health', {
                url: '/health',
                cache: false,
                views: {
                    'tab-xueya': {
                        templateUrl: 'templates/home/date-health.html',
                        controller:'xueYaCtrl'
                    }
                }
            })
            .state('tab.plan', {
                url: '/plan',
                cache: false,
                views: {
                    'tab-xueya': {
                        templateUrl: 'templates/home/plan.html',
                        controller:'xueYaCtrl'
                    }
                }
            })
            .state('tab.registration', {
                url: '/registration',
                cache: false,
                views: {
                    'tab-xueya': {
                        templateUrl: 'templates/home/registration.html',
                        controller:'xueYaCtrl'
                    }
                }
            })
            .state('tab.remind', {
                url: '/remind',
                cache: false,
                views: {
                    'tab-xueya': {
                        templateUrl: 'templates/home/remind.html',
                        controller:'xueYaCtrl'
                    }
                }
            })
            //咨询
            .state('tab.zixun', {
                url: '/zixun',
                cache: true,
                views: {
                    'tab-zixun': {
                        templateUrl: 'templates/information/tab-health.html',
                        controller:'ziXunCtrl'
                    }
                }
            })
            //社区
            .state('tab.shequ', {
                url: '/shequ',
                cache: false,
                views: {
                    'tab-shequ': {
                        templateUrl: 'templates/zone/tab-zone-index.html',
                        controller:'sheQuCtrl'
                    }
                }
            })

            //我的
            .state('tab.user', {
                url: '/user',
                cache: false,
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/tab-homepage.html',
                        controller:'userCtrl'
                    }
                }
            })
            .state('public.user', {
                url: '/login',
                cache: false,
                views: {
                    'tab-user': {
                        templateUrl: 'templates/login.html',
                        controller:'userCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/xueya');

    });
