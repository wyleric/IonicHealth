angular.module('starter.controllers', [])

    .controller('publicCtrl', function ($scope, $ionicHistory,$ionicLoading, $ionicPopup, $state, $ionicModal,LoginService,$timeout,$ionicPopover) {
        $scope.backGo = function() {
            $ionicHistory.goBack();
        };

        // 登录
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal_login = modal;
            $scope.loginData = {};
        });

        $scope.login = function() {
            $scope.modal_login.show();
        };
        $scope.closeLogin= function() {
            $scope.modal_login.hide();
            $scope.loginData = {};
        };
        $scope.removeLogin= function() {
            $scope.modal_login.remove();
            $scope.loginData = {};
        };

        //处理登录提交
        $scope.doLogin = function () {
            if (!$scope.loginData.mobile) {
                $scope.showMsg('手机号不能为空');
                return false;
            };
            if (!$scope.loginData.password) {
                $scope.showMsg('密码不能为空');
                return false;
            };
            $ionicLoading.show({
                template: "正在登录..."
            });
            LoginService.loginUser($scope.loginData.mobile, $scope.loginData.password).success(function (data) {
                //登录成功
                localStorage.jininghaslogin = 1;
                localStorage.jiningmobile = $scope.loginData.mobile;
                $ionicLoading.hide();
                $scope.closeLogin();
               // $state.go('tab.xueya');

            }).error(function (data) {
                localStorage.jininghaslogin = 0;
                $ionicLoading.hide();
                $scope.showMsg('登录失败');
            });
        };

        // 注册
        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal_register = modal;
            $scope.registerData = {};
        });

        $scope.register = function() {
            $scope.modal_register.show();
        };

        $scope.closeRegister= function() {
            $scope.modal_register.hide();
            $scope.registerData = {};
        };
        //处理注册
        $scope.doRegister = function() {
            var reg = /^1\d{10}$/;
            if (!$scope.registerData.mobile) {
                $scope.showMsg('手机号不能为空');
                return false;
            } else if (!reg.test($scope.registerData.mobile)) {
                $scope.showMsg('手机号格式错误');
                return false;
            };
            if (!$scope.registerData.username) {
                $scope.showMsg('昵称不能为空');
                return false;
            }
            if (!$scope.registerData.name) {
                $scope.showMsg('姓名不能为空');
                return false;
            }
            if (!$scope.registerData.birthday) {
                $scope.showMsg('请选择生日');
                return false;
            }
            if ($scope.registerData.sex!=1 && $scope.registerData.sex!=0) {
                $scope.showMsg('请选择性别');
                return false;
            }
            if (!$scope.registerData.xieyi) {
                $scope.showMsg('请同意协议');
                return false;
            }
            $ionicLoading.show({
                template: '注册中...'
            });
            LoginService.register($scope.registerData.mobile, $scope.registerData.username,$scope.registerData.name,$scope.registerData.birthday,$scope.registerData.sex).success(function (data) {
                //登录成功
                $ionicLoading.hide();
                $scope.showMsg('注册成功');
                $scope.closeRegister();

            }).error(function (data) {
                $ionicLoading.hide();
                $scope.showMsg(data);
            });
        };
        //信息提示框
        $scope.showMsg = function(txt) {
            var template = '<ion-popover-view style = "background-color:#ef473a !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
            $scope.popover = $ionicPopover.fromTemplate(template, {
                scope: $scope
            });
            $scope.popover.show();
            $timeout(function() {
                $scope.popover.hide();
            }, 1400);
        };
        //日期选择
        $scope.formatDate = function(date, format){
            if (!date) return;
            if (!format) format = "yyyy-MM-dd";
            switch(typeof date) {
                case "string":
                    date = new Date(date.replace(/-/, "/"));
                    break;
                case "number":
                    date = new Date(date);
                    break;
            }
            if (!date instanceof Date) return;
            var dict = {
                "yyyy": date.getFullYear(),
                "M": date.getMonth() + 1,
                "d": date.getDate(),
                "H": date.getHours(),
                "m": date.getMinutes(),
                "s": date.getSeconds(),
                "MM": ("" + (date.getMonth() + 101)).substr(1),
                "dd": ("" + (date.getDate() + 100)).substr(1),
                "HH": ("" + (date.getHours() + 100)).substr(1),
                "mm": ("" + (date.getMinutes() + 100)).substr(1),
                "ss": ("" + (date.getSeconds() + 100)).substr(1)
            };
            return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
                return dict[arguments[0]];
            });
        }
        var weekDaysList = ["日", "一", "二", "三", "四", "五", "六"];
        var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
        var datePickerCallback = function (val) {
            if (typeof(val) === 'undefined') {
                console.log('No date selected');
            } else {
                console.log('Selected date is : ',  $scope.formatDate(val,'yyyy-MM-dd'));
                $scope.registerData.birthday =  $scope.formatDate(val,'yyyy-MM-dd');
            }
        };
        $scope.datepickerObject = {
            titleLabel: '选择日期',  //Optional
            todayLabel: '今天',  //Optional
            closeLabel: '关闭',  //Optional
            setLabel: '确定',  //Optional
            setButtonType : 'button-assertive',  //Optional
            todayButtonType : 'button-assertive',  //Optional
            closeButtonType : 'button-assertive',  //Optional
            //inputDate: new Date(),  //Optional
            mondayFirst: false,  //Optional
            //disabledDates: disabledDates, //Optional
            weekDaysList: weekDaysList, //Optional
            monthList: monthList, //Optional
            templateType: 'popup', //Optional
            showTodayButton: 'true', //Optional
            modalHeaderColor: 'bar-positive', //Optional
            modalFooterColor: 'bar-positive', //Optional
            //from: new Date(2012, 8, 2), //Optional
            //to: new Date(2018, 8, 25),  //Optional
            callback: function (val) {  //Mandatory
                datePickerCallback(val);
            },
            dateFormat: 'yyyy-MM-dd', //Optional
            closeOnSelect: true //Optional
        };
        // 协议
        $ionicModal.fromTemplateUrl('templates/user/xieyi.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal_xieyi = modal;
            $scope.xieyiData = {};
        });

        $scope.showXieYi = function() {
            $scope.modal_xieyi.show();
        };
        $scope.closeXieYi= function() {
            $scope.modal_xieyi.hide();
            $scope.xieyiData = {};
        };
    })
    //血压管理
    .controller('xueYaCtrl', function ($scope, $ionicModal,$state,LoginService,FamilyService,BloodService,$ionicLoading,HospitalService) {

        if (localStorage.jininghaslogin != 1) {
            var flag = $scope.login();
        };
        var weekDaysList = ["日", "一", "二", "三", "四", "五", "六"];
        var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
        var datePickerCallback = function (val) {
            if (typeof(val) === 'undefined') {
                console.log('No date selected');
            } else {
                console.log('Selected date is : ',  $scope.formatDate(val,'yyyy-MM-dd'));
                $scope.birthday =  $scope.formatDate(val,'yyyy-MM-dd');
                $scope.recordData.birthday =  $scope.formatDate(val,'yyyy-MM-dd');
            }
        };
        $scope.datepickerObject = {
            titleLabel: '选择日期',  //Optional
            todayLabel: '今天',  //Optional
            closeLabel: '关闭',  //Optional
            setLabel: '确定',  //Optional
            setButtonType : 'button-assertive',  //Optional
            todayButtonType : 'button-assertive',  //Optional
            closeButtonType : 'button-assertive',  //Optional
            //inputDate: new Date(),  //Optional
            mondayFirst: false,  //Optional
            //disabledDates: disabledDates, //Optional
            weekDaysList: weekDaysList, //Optional
            monthList: monthList, //Optional
            templateType: 'popup', //Optional
            showTodayButton: 'true', //Optional
            modalHeaderColor: 'bar-positive', //Optional
            modalFooterColor: 'bar-positive', //Optional
            //from: new Date(2012, 8, 2), //Optional
            //to: new Date(2018, 8, 25),  //Optional
            callback: function (val) {  //Mandatory
                datePickerCallback(val);
            },
            dateFormat: 'yyyy-MM-dd', //Optional
            closeOnSelect: true //Optional
        };
        // 记录血压页面
        $ionicModal.fromTemplateUrl('templates/home/record.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal_record = modal;
            $scope.recordData = {};
        });

        $scope.recordAdd = function() {
            $scope.modal_record.show();
        };
        $scope.closeRecord= function() {
            $scope.modal_record.hide();
            $scope.recordData = {};
        };
        // 血压报告
        $ionicModal.fromTemplateUrl('templates/home/tab-report.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal_report = modal;
            $scope.reportData = {};
        });

        $scope.reportAdd = function() {
            $scope.modal_report.show();
        };
        $scope.closeReport= function() {
            $scope.modal_report.hide();
            $scope.reportData = {};
        };
        // 健康数据
        $ionicModal.fromTemplateUrl('templates/home/date-health.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal_date_health = modal;
            $scope.dateHealthData = {};
        });

        $scope.dateHealthAdd = function() {
            $scope.modal_date_health.show();
        };
        $scope.closeDateHealth= function() {
            $scope.modal_date_health.hide();
            $scope.dateHealthData = {};
        };
        // 降压方案
        $ionicModal.fromTemplateUrl('templates/home/plan.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal_plan = modal;
            $scope.planData = {};
        });

        $scope.planAdd = function() {
            $scope.modal_plan.show();
        };
        $scope.closePlan= function() {
            $scope.modal_plan.hide();
            $scope.planData = {};
        };
        // 医院
        $ionicModal.fromTemplateUrl('templates/home/registration.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal_registration = modal;
            $scope.registrationData = {};
        });
        $scope.registrationDataView = function() {
            $scope.modal_registration.show();
        };
        $scope.closeRegistration= function() {
            $scope.modal_registration.hide();
            $scope.registrationData = {};
        };
        //血压评估
        $scope.report = function(){
            if (localStorage.jininghaslogin != 1) {
                var flag = $scope.login();
            }else{

                FamilyService.getList($scope).success(function(data){
                    if(data.length>0){
                        console.log(data[0].id);
                        $scope.recordData.familyid = data[0].id;
                    }else{
                        $scope.showMsg('请添加人员');
                        $state.go('tab.user');
                        $scope.closeReport();
                    }

                });
                $scope.reportAdd();
            }

        };

        //健康数据
        $scope.health = function(){
            if (localStorage.jininghaslogin != 1) {
                var flag = $scope.login();
            }else{
                FamilyService.getList($scope).success(function(data){
                	
                	if(data.length>0){
                        console.log(data[0].id);
                        $scope.dateHealthData.familyid = data[0].id;
                        BloodService.getBlood(data[0].id).success(function(blood){
                        	if(blood==1){
                        		$scope.showMsg('暂无数据');
                        		$state.go('tab.xueya');
                        		$scope.closeDateHealth();
                        	}else{
                        		console.log(blood);
                            	$scope.dateHealthData.listblood = blood.listblood;
                            	$scope.dateHealthData.nowyear = blood.nowyear;
                            	$scope.dateHealthData.nowmonth = blood.nowmonth;
                                var data = {
                                    labels :blood.timestr,
                                    datasets : [
                                        {
                                            fillColor : "#09b0de",
                                            strokeColor : "#09b0de",
                                            pointColor : "#09b0de",
                                            pointStrokeColor : "#fff",
                                            data : blood.sbpstr
                                        },
                                        {
                                            fillColor : "#92d7ea",
                                            strokeColor : "#92d7ea",
                                            pointColor : "#92d7ea",
                                            pointStrokeColor : "#fff",
                                            data :blood.dbpstr
                                        }
                                    ]
                                }

                                var ctx = document.getElementById("xylog").getContext("2d");
                                window.myLine = new Chart(ctx).Line(data, {
                                    responsive: true
                                });
                        	}
                        	
                        }).error(function(data){
                        	
                        })
                        
                    }else{
                        $scope.showMsg('请添加人员');
                        $state.go('tab.user');
                        $scope.closeDateHealth();
                    }

                });
                $scope.dateHealthAdd();
            }
        };
        $scope.selectFamily = function(){
               BloodService.getBlood($scope.dateHealthData.familyid).success(function(blood){
                if(blood==1){
                	$scope.showMsg('暂无数据');
            		$state.go('tab.xueya');
            		$scope.closeDateHealth();
                }else {
                    $scope.dateHealthData.listblood = blood.listblood;
                    $scope.dateHealthData.nowyear = blood.nowyear;
                    $scope.dateHealthData.nowmonth = blood.nowmonth;
                    var data = {
                        labels: blood.timestr,
                        datasets: [
                            {
                                fillColor: "#09b0de",
                                strokeColor: "#09b0de",
                                pointColor: "#09b0de",
                                pointStrokeColor: "#fff",
                                data: blood.sbpstr
                            },
                            {
                                fillColor: "#92d7ea",
                                strokeColor: "#92d7ea",
                                pointColor: "#92d7ea",
                                pointStrokeColor: "#fff",
                                data: blood.dbpstr
                            }
                        ]
                    }

                    var ctx = document.getElementById("xylog").getContext("2d");
                    window.myLine = new Chart(ctx).Line(data, {
                        responsive: true
                    });
                }
                   }).error(function(data){
                   	
                   })

        }
        //降压方案
        $scope.plan = function(){
            if (localStorage.jininghaslogin != 1) {
                var flag = $scope.login();
            }else{
                FamilyService.getList($scope).success(function(data){
                    if(data.length>0){
                        console.log(data[0].id);
                        $scope.planData.familyid = data[0].id;
                    }else{
                        $scope.showMsg('请添加人员');
                        $state.go('tab.user');
                        $scope.closePlan();
                    }

                });
                $scope.planAdd();
            }
        };
        //就诊挂号
        $scope.registration = function(){
            if (localStorage.jininghaslogin != 1) {
                var flag = $scope.login();
            }else {
                $ionicLoading.show({
                    template: '数据加载中...'
                });
                HospitalService.hospitalView().success(function(data){
                    $ionicLoading.hide();
                    $scope.registrationData.hospitalname = data.hospitalname;
                    $scope.registrationData.hospital = data.hospital;
                }).error(function(error){
                    $ionicLoading.hide();
                    $scope.showMsg(error);
                });
                $scope.registrationDataView();
            }
        };
        $scope.openHospital = function(url){
            if (localStorage.jininghaslogin != 1) {
                var flag = $scope.login();
            }else {
               window.open(url);
            }
        }
        //测量提醒
        $scope.remind = function(){
            if (localStorage.jininghaslogin != 1) {
                var flag = $scope.login();
            }else {
                $state.go("tab.remind");
            }
        };
        //血压记录
        $scope.record = function(){
            if (localStorage.jininghaslogin != 1) {
                var flag = $scope.login();
            }else {
                $scope.recordAdd();
                FamilyService.getList($scope);
            }
        };
        //处理血压添加事件
        $scope.doRecord = function(){
            if (localStorage.jininghaslogin != 1) {
                var flag = $scope.login();
            }else {
                if (!$scope.recordData.familyid) {
                    $scope.showMsg('请选择用户');
                    return false;
                }
                if (!$scope.recordData.birthday) {
                    $scope.showMsg('请选择测量日期');
                    return false;
                }
                if (!$scope.recordData.sBP) {
                    $scope.showMsg('请填写高压数值');
                    return false;
                }
                if (!$scope.recordData.dBP) {
                    $scope.showMsg('请填写低压数值');
                    return false;
                }
                if (!$scope.recordData.pulse) {
                    $scope.showMsg('请填写心率');
                    return false;
                }
                $ionicLoading.show({
                    template: '数据传输中...'
                });
                BloodService.bloodAdd($scope.recordData.familyid,$scope.recordData.birthday,$scope.recordData.sBP,$scope.recordData.dBP,$scope.recordData.pulse,$scope.recordData.remark).success(function(data){
                    $ionicLoading.hide();
                    $scope.showMsg("添加成功");
                    $scope.closeRecord();
                }).error(function(data){
                    $ionicLoading.hide();
                    $scope.showMsg("网络异常，添加失败");
                });
            }
        };

    })
    //资讯
    .controller('ziXunCtrl', function ($scope, $ionicModal,$state,ZiXunFactory,$ionicLoading) {
        if (localStorage.jininghaslogin != 1) {
            $state.go("tab.xueya");
        }else{
            // 咨询详情页
            $ionicModal.fromTemplateUrl('templates/information/acticle.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal_acticle = modal;
                $scope.acticleData = {};
            });
            $scope.acticleView = function() {
                $scope.modal_acticle.show();
            };
            $scope.closeActicle= function() {
                $scope.modal_acticle.hide();
                $scope.acticleData = {};
            };
            $scope.getZiXun = function(type){
                $ionicLoading.show({
                    template:'数据加载中....'
                });
                ZiXunFactory.all($scope,type).success(function(data){
                    $ionicLoading.hide();
                }).error(function(data){
                    $ionicLoading.hide();
                });
            };
            $scope.doRefresh = function(type){
                ZiXunFactory.all($scope,type);
                $scope.$broadcast('scroll.refreshComplete');
            }
            $scope.views = function(title,content){
                $scope.acticleView();
                $scope.acticleData.title = title;
                $scope.acticleData.content = content;
            }
        }

    })
    //社区
    .controller('sheQuCtrl', function ($scope, $ionicModal,$state,PostService,$ionicLoading) {
        if (localStorage.jininghaslogin != 1) {
            $state.go("tab.xueya");
        }else{
            // 发帖页
            $ionicModal.fromTemplateUrl('templates/zone/publish.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal_post = modal;
                $scope.postData = {};
            });
            $scope.postAdd = function() {
                $scope.modal_post.show();
            };
            $scope.closePost= function() {
                $scope.modal_post.hide();
                $scope.postData = {};
                PostService.get().success(function(data){
                    $scope.posts = data;
                }).error(function(){
                    $scope.showMsg('数据加载失败');
                });
            };
            // 查看帖子详情
            $ionicModal.fromTemplateUrl('templates/zone/com-con.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal_viewpost = modal;
                $scope.viewpostData = {};
            });
            $scope.viewpostAdd = function() {
                $scope.modal_viewpost.show();
            };
            $scope.closeViewPost= function() {
                $scope.modal_viewpost.hide();
                $scope.viewpostData = {};
            };
            //加载帖子数据
            $ionicLoading.show({
                template:'数据加载中....'
            });
            PostService.get().success(function(data){
                $ionicLoading.hide();
                $scope.posts = data;
            }).error(function(){
                $ionicLoading.hide();
                $scope.showMsg('数据加载失败');
            });
            //点击发帖按钮
            $scope.post = function(){
                $scope.postAdd();
            };
            //查看详情
            $scope.viewPost = function(postid,username,addtime,content,title){
                $scope.viewpostData.postid = postid;
                $scope.viewpostData.username = username;
                $scope.viewpostData.addtime = addtime;
                $scope.viewpostData.content = content;
                $scope.viewpostData.title = title;
                $ionicLoading.show({
                    template:'数据加载中....'
                });
                PostService.getReply(postid).success(function(data){
                    $ionicLoading.hide();
                    $scope.viewpostData.sizes = data.length;
                    $scope.viewpostData.replys = data;
                }).error(function(data){
                    $ionicLoading.hide();
                    $scope.showMsg(data.message);
                });
                $scope.viewpostAdd();
            };
            //处理回帖请求
            $scope.saveReply = function(){
                if(!$scope.viewpostData.replyContent){
                    $scope.showMsg('回复内容不能为空');
                    return false;
                }
                $ionicLoading.show({
                    template:'数据传输中....'
                });
                PostService.addReply($scope.viewpostData.replyContent,$scope.viewpostData.postid).success(function(data){
                    $ionicLoading.hide();
                    PostService.getReply($scope.viewpostData.postid).success(function(data){
                        $scope.viewpostData.sizes = data.length;
                        $scope.viewpostData.replys = data;
                    }).error(function(data){
                        $scope.showMsg('读取失败，请检查网络');
                    });
                }).error(function(data){
                    $ionicLoading.hide();
                    $scope.showMsg(data);
                });
            };
            //处理发帖请求
            $scope.doPost = function(){
                if(!$scope.postData.title){
                    $scope.showMsg('标题不能为空');
                    return false;
                }
                if(!$scope.postData.content){
                    $scope.showMsg('内容不能为空');
                    return false;
                }
                $ionicLoading.show({
                    template: '数据提交中...'
                });
                PostService.postAdd($scope.postData.title,$scope.postData.content).success(function(data){
                    $ionicLoading.hide();
                    $scope.showMsg("发帖成功");
                    $scope.closePost();
                }).error(function(data){
                    $ionicLoading.hide();
                    $scope.showMsg(data);
                });
            }

        }
    })
    //个人中心
    .controller('userCtrl', function ($scope, $ionicModal,$state,$ionicLoading,FamilyService,$ionicActionSheet,LoginService,$cordovaAppVersion) {
        if (localStorage.jininghaslogin != 1) {
            $state.go("tab.xueya");
        }else{
            $scope.loginmobile = localStorage.jiningmobile;
            var weekDaysList = ["日", "一", "二", "三", "四", "五", "六"];
            var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
            var datePickerCallback = function (val) {
                if (typeof(val) === 'undefined') {
                    console.log('No date selected');
                } else {
                    console.log('Selected date is : ',  $scope.formatDate(val,'yyyy-MM-dd'));
                    $scope.birthday =  $scope.formatDate(val,'yyyy-MM-dd');
                    $scope.familyAddData.birthday =  $scope.formatDate(val,'yyyy-MM-dd');
                }
            };
            $scope.datepickerObject = {
                titleLabel: '选择日期',  //Optional
                todayLabel: '今天',  //Optional
                closeLabel: '关闭',  //Optional
                setLabel: '确定',  //Optional
                setButtonType : 'button-assertive',  //Optional
                todayButtonType : 'button-assertive',  //Optional
                closeButtonType : 'button-assertive',  //Optional
                //inputDate: new Date(),  //Optional
                mondayFirst: false,  //Optional
                //disabledDates: disabledDates, //Optional
                weekDaysList: weekDaysList, //Optional
                monthList: monthList, //Optional
                templateType: 'popup', //Optional
                showTodayButton: 'true', //Optional
                modalHeaderColor: 'bar-positive', //Optional
                modalFooterColor: 'bar-positive', //Optional
                //from: new Date(2012, 8, 2), //Optional
                //to: new Date(2018, 8, 25),  //Optional
                callback: function (val) {  //Mandatory
                    datePickerCallback(val);
                },
                dateFormat: 'yyyy-MM-dd', //Optional
                closeOnSelect: true //Optional
            };
            // 家人添加页面
            $ionicModal.fromTemplateUrl('templates/user/family-add.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal_familyadd = modal;
                $scope.familyAddData = {};
            });

            $scope.familyAdd = function() {
                $scope.modal_familyadd.show();
            };
            $scope.closeFamilyAdd= function() {
                $scope.modal_familyadd.hide();
                $scope.familyAddData = {};
            };
            //积分页面
            $ionicModal.fromTemplateUrl('templates/user/integral.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal_jifen = modal;
                $scope.jifenData = {};
            });

            $scope.jifenView = function() {
                $scope.modal_jifen.show();
            };
            $scope.closeJifen= function() {
                $scope.modal_jifen.hide();
                $scope.jifenData = {};
            };
            // 家人查看页面
            $ionicModal.fromTemplateUrl('templates/user/family.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal_family = modal;
                $scope.familyData = {};
            });

            $scope.familyView = function() {
                $scope.modal_family.show();
            };
            $scope.closeFamily= function() {
                $scope.modal_family.hide();
                $scope.familyData = {};
            };
            //设置页面
            $ionicModal.fromTemplateUrl('templates/user/setup.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal_setup = modal;
                $scope.setupData = {};
            });

            $scope.setUp = function() {
                $scope.modal_setup.show();
            };
            $scope.closeSetup= function() {
                $scope.modal_setup.hide();
                $scope.setupData = {};
            };
            //公司介绍页面
            $ionicModal.fromTemplateUrl('templates/user/about.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal_about = modal;
                $scope.aboutData = {};
            });

            $scope.about = function() {
                $scope.modal_about.show();
            };
            $scope.closeAbout= function() {
                $scope.modal_about.hide();
                $scope.aboutData = {};
            };
            //建议添加页面
            $ionicModal.fromTemplateUrl('templates/user/suggestion.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal_suggestion = modal;
                $scope.suggestionData = {};
            });

            $scope.suggestion = function() {
                $scope.modal_suggestion.show();
            };
            $scope.closeSuggestion= function() {
                $scope.modal_suggestion.hide();
                $scope.suggestionData = {};
            };
            //家人查看
            $scope.viewFamily = function(){
                if (localStorage.jininghaslogin != 1) {
                    var flag = $scope.login();
                }else {
                    $ionicLoading.show({
                        template: '数据加载中...'
                    });
                    $scope.familyView();
                    FamilyService.getList($scope).success(function(data){
                        $ionicLoading.hide();
                    }).error(function(){
                        $ionicLoading.hide();
                    });
                }
            }

            //家人添加
            $scope.addFamily = function(){
                if (localStorage.jininghaslogin != 1) {
                    var flag = $scope.login();
                }else {
                    $scope.familyAdd();
                }
            }
            //处理家人添加
            $scope.doAddFamily = function() {
                if (!$scope.familyAddData.name) {
                    $scope.showMsg('昵称不能为空');
                    return false;
                }
                if (!$scope.familyAddData.birthday) {
                    $scope.showMsg('生日不能为空');
                    return false;
                }
                if (!$scope.familyAddData.sex) {
                    $scope.showMsg('请选择性别');
                    return false;
                }
                if (!$scope.familyAddData.weight) {
                    $scope.showMsg('请输入体重');
                    return false;
                }
                $ionicLoading.show({
                    template: '数据提交中...'
                });
                FamilyService.familyAdd($scope.familyAddData.name, $scope.familyAddData.birthday,$scope.familyAddData.weight,$scope.familyAddData.remark,$scope.familyAddData.sex).success(function (data) {
                    //添加成功
                    $ionicLoading.hide();
                    $scope.showMsg('添加成功');
                    $scope.closeFamilyAdd();
                    $ionicLoading.show({
                        template: '数据加载中...'
                    });
                    FamilyService.getList($scope).success(function(data){
                        $ionicLoading.hide();
                    }).error(function(){
                        $ionicLoading.hide();
                    });

                }).error(function (data) {
                    $ionicLoading.hide();
                    $scope.showMsg("网络异常，添加失败");
                });
            };
            //积分页面
            $scope.viewJifen = function(){
                if (localStorage.jininghaslogin != 1) {
                    var flag = $scope.login();
                }else {
                    $scope.jifenView();
                    FamilyService.getjifen().success(function (data) {
                        console.log(data.jifen);
                        $scope.jifenData.jifen = data.jifen;
                    }).error(function (data) {
                        $scope.showMsg("网络异常，积分获取失败");
                    });
                }
            };
            //退订
            $scope.showActionsheet = function () {
                $ionicActionSheet.show({
                    titleText: '确定退订血压管家业务？',
                    buttons: [
                        {
                            text: '退订'
                        }

                    ],
                    cancelText: '取消',
                    cancel: function () {
                        console.log('CANCELLED');
                    },
                    buttonClicked: function (index) {
                        console.log('BUTTON CLICKED', index);
                        FamilyService.tuiding().success(function (data) {
                            $scope.showMsg('退订成功');
                            $scope.logout();
                        }).error(function (data) {
                            $scope.showMsg("退订失败");
                        });
                        return true;
                    },
                    destructiveButtonClicked: function () {
                        console.log('DESTRUCT');
                        return true;
                    }
                });
            };
            //签到
            $scope.qiandao = function(){
                if (localStorage.jininghaslogin != 1) {
                    $state.go("tab.xueya");
                }else {
                    $ionicLoading.show({
                        template: '数据提交中...'
                    });
                    FamilyService.qiandao().success(function (data) {
                        $ionicLoading.hide();
                        $scope.showMsg("签到成功");
                    }).error(function (data) {
                        $ionicLoading.hide();
                        $scope.showMsg(data);
                    });
                }
            };
            //意见添加处理
            $scope.suggestionAdd = function(){
                if (localStorage.jininghaslogin != 1) {
                    var flag = $scope.login();
                }else {
                    if(!$scope.suggestionData.content){
                        $scope.showMsg('请填写内容');
                        return false;
                    }
                    $ionicLoading.show({
                        template: '数据提交中...'
                    });
                    LoginService.suggestionAdd($scope.suggestionData.content).success(function (data) {
                        $ionicLoading.hide();
                        $scope.showMsg("信息提交成功");
                        $scope.closeSuggestion();
                    }).error(function (data) {
                        $ionicLoading.hide();
                        $scope.showMsg(data);
                    });
                }
            };

            $scope.checkUpdata = function() {
                cordova.getAppVersion.getVersionNumber().then(function(version){
                $ionicLoading.show({
                    template: '检测版本中...'
                });
                LoginService.update(version).success(function(data){
                    $ionicLoading.hide();
                    $scope.showMsg(data);
                }).error(function(data){
                    $ionicLoading.hide();
                    $scope.showMsg(data);
                });
            });
               /** $ionicLoading.show({
                    template: '检测版本中...'
                });
                alert(1.1);
                LoginService.update('1.1.2').success(function(data){
                    $ionicLoading.hide();
                    // $scope.showMsg(data);
                }).error(function(data){
                    $ionicLoading.hide();
                    $scope.showMsg(data);
                });**/
            }

            $scope.showUpdateConfirm = function(desc, url) {
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
            $scope.logout = function () {
                localStorage.removeItem("jininghaslogin");
                localStorage.jiningmobile = "";
                localStorage.jininguserid = "";
                $state.go("tab.xueya");
            }

        }

    });
