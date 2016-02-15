angular.module('starter.services', [])

    .constant('ApiEndpoint', {
        //url: 'http://localhost:8080/WZ_ICT_jining/api/'
        url: 'http://120.192.167.47:9090/api/'
    })

    .factory('ZiXunFactory', function ($q, $http,ApiEndpoint) {
        return {
            all: function ($scope,type) {
                var d = $q.defer();
                var promise = d.promise;

                $http.jsonp(ApiEndpoint.url+"zixun/getzixun?type=" + type +  "&callback=JSON_CALLBACK")
                    .success(function (data) {
                        $scope.healths = data;
                        d.resolve(data);
                    })
                    .error(function (error) {
                        d.reject(error);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return d.promise;
            }
        };
    })

    .service('LoginService', function ($q, $http,ApiEndpoint,$ionicPopup) {

        return {
            loginUser: function (name, pw) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var loginResult = new Object();
                //ajax请求
                $http.jsonp(ApiEndpoint.url+"user/login?appUserFormMap.mobile=" + name + "&appUserFormMap.password=" + pw + "&callback=JSON_CALLBACK")
                    .success(function (response) {
                        loginResult = response;
                        if (loginResult.code == 1) {
                            localStorage.jininguserid = loginResult.id;
                            var arrayObj = new Array("Tags" + loginResult.UserId);
                            deferred.resolve('Welcome ' + name + '!');
                        } else {
                            deferred.reject(loginResult.message);
                        }
                    }).error(function (error) {
                        deferred.reject("登录超时，请检查网络");
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            },

            register: function (mobile, username,name,birthday,sex) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                //ajax请求
                $http.jsonp(ApiEndpoint.url+"user/register?appUserFormMap.mobile=" + mobile + "&appUserFormMap.username=" + username + "&appUserFormMap.name=" + name + "&appUserFormMap.birthday="+birthday+ "&appUserFormMap.sex="+sex+"&callback=JSON_CALLBACK")
                    .success(function (response) {
                        if (response.code == 1) {
                            deferred.resolve('register successfully');
                        } else {
                            deferred.reject(response.message);
                        }
                    }).error(function(error){
                        deferred.reject('网络异常，请稍后重试');
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            },
            suggestionAdd: function (content) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                //ajax请求
                $http.jsonp(ApiEndpoint.url+"user/addSuggestion?appSuggestionFormMap.mobile=" + localStorage.jiningmobile + "&appSuggestionFormMap.userid=" + localStorage.jininguserid + "&appSuggestionFormMap.content=" + content +"&callback=JSON_CALLBACK")
                    .success(function (response) {
                        if (response.code == 1) {
                            deferred.resolve('register successfully');
                        } else {
                            deferred.reject(response.message);
                        }
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            },
            //检查更新
            update: function (version) {
                var d = $q.defer();
                var promise = d.promise;
                $http.jsonp(ApiEndpoint.url+'user/update?version=' + version +'&callback=JSON_CALLBACK').success(function(data) {
                    console.log(data);
                    if (data.code != 0) {
                        if (version != data.version) {
                            var confirmPopup = $ionicPopup.confirm({
                                title: '有新版本了！是否要升级？',
                                template: data.message,
                                cancelText: '下一次',
                                okText: '确定'
                            });
                            confirmPopup.then(function(res) {
                                if (res) {
                                    window.open(data.url, '_system', 'location=yes');
                                };
                            });
                            d.resolve('更新成功 ');
                        } else {
                            d.resolve('目前是最新版本 ');
                        }
                    } else {
                        d.reject('服务器连接错误，请稍微再试');
                    }
                });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return d.promise;
            }
        }
    })
    .service('FamilyService', function ($q, $http,ApiEndpoint) {

        return {
            //添加家人信息
            familyAdd: function (name, birthday,weight,remark,sex) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var FamilyAddResult = new Object();
                //ajax请求
                $http.jsonp(ApiEndpoint.url + "family/add?appFamilyFormMap.name=" + name + "&appFamilyFormMap.sex=" + sex + "&appFamilyFormMap.birthday=" + birthday + "&appFamilyFormMap.weight=" + weight + "&appFamilyFormMap.remark=" + remark + "&appFamilyFormMap.userid=" + localStorage.jininguserid + "&callback=JSON_CALLBACK")
                    .success(function (response) {
                        FamilyAddResult = response;
                        if (FamilyAddResult.code == 1) {
                            deferred.resolve('添加成功 ');
                        } else {
                            deferred.reject(FamilyAddResult.message);
                        }
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            },
            //获取家人信息
            getList: function ($scope) {
                var d = $q.defer();
                var promise = d.promise;

                $http.jsonp(ApiEndpoint.url+"family/getfamily?userId=" + localStorage.jininguserid +  "&callback=JSON_CALLBACK")
                    .success(function (data) {
                        console.log(data);
                        $scope.familys = data;
                        d.resolve(data);
                    })
                    .error(function (error) {
                        d.reject(error);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return d.promise;
            },
            //退订处理
            tuiding: function ($scope) {
                var d = $q.defer();
                var promise = d.promise;
                $http.jsonp(ApiEndpoint.url+"family/tuiding?userId=" + localStorage.jininguserid + "&mobile="+localStorage.jiningmobile+ "&callback=JSON_CALLBACK")
                    .success(function (data) {
                        d.resolve(data);
                    })
                    .error(function (error) {
                        d.reject(error);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return d.promise;
            },
            //获取用户积分
            getjifen: function ($scope) {
                var d = $q.defer();
                var promise = d.promise;
                $http.jsonp(ApiEndpoint.url+"family/getjifen?userId=" + localStorage.jininguserid + "&callback=JSON_CALLBACK")
                    .success(function (data) {
                        d.resolve(data);
                    })
                    .error(function (error) {
                        d.reject(error);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return d.promise;
            },
            //签到
            qiandao: function ($scope) {
                var d = $q.defer();
                var promise = d.promise;
                $http.jsonp(ApiEndpoint.url+"family/qiandao?userId=" + localStorage.jininguserid + "&mobile="+localStorage.jiningmobile+ "&callback=JSON_CALLBACK")
                    .success(function (data) {
                        console.log(data.code);
                        if (data.code == 1) {
                            d.resolve('添加成功 ');
                        } else {
                            d.reject(data.message);
                        }
                    })
                    .error(function (error) {
                        d.reject(error);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return d.promise;
            }
        }


    })
    .service('BloodService', function ($q, $http,ApiEndpoint) {

        return {
            //添加血压数据
            bloodAdd: function (familyid, birthday,sBP,dBP,pulse,remark) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var RecordResult = new Object();
                //ajax请求
                $http.jsonp(ApiEndpoint.url + "blood/add?appBloodFormMap.sBP=" + sBP + "&appBloodFormMap.dBP=" + dBP + "&appBloodFormMap.pulse=" + pulse + "&appBloodFormMap.userid=" + localStorage.jininguserid + "&appBloodFormMap.familyid=" + familyid + "&appBloodFormMap.addtime=" + birthday + "&appBloodFormMap.remark=" + remark+ "&callback=JSON_CALLBACK")
                    .success(function (response) {
                        RecordResult = response;
                        if (RecordResult.code == 1) {
                            deferred.resolve('添加成功 ');
                        } else {
                            deferred.reject(RecordResult.message);
                        }
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            },
            //获取血压数据
            getBlood: function (familyid) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var RecordResult = new Object();
                //ajax请求
                $http.jsonp(ApiEndpoint.url + "blood/get?appBloodFormMap.familyid=" + familyid + "&appBloodFormMap.userid=" + localStorage.jininguserid + "&callback=JSON_CALLBACK")
                    .success(function (response) {
                    	if(response.code==0){
                    		deferred.resolve('1');
                    	}else{
                    		deferred.resolve(response);
                    	}
                    }) .error(function (error) {
                    	deferred.reject(error);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            }


        }


    })
    .service('PostService', function ($q, $http,ApiEndpoint) {

        return {
            //添加发帖数据
            postAdd: function (title, content) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var PostResult = new Object();
                //ajax请求
                $http.jsonp(ApiEndpoint.url + "post/add?appPostFormMap.title=" + title + "&appPostFormMap.content=" + content + "&appPostFormMap.userid=" +  localStorage.jininguserid + "&callback=JSON_CALLBACK")
                    .success(function (response) {
                        PostResult = response;
                        if (PostResult.code == 1) {
                            deferred.resolve('发帖成功 ');
                        } else {
                            deferred.reject(PostResult.message);
                        }
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            },
            //获取发帖数据
            get: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                //ajax请求
                $http.jsonp(ApiEndpoint.url + "post/get?callback=JSON_CALLBACK")
                    .success(function (response) {
                        deferred.resolve(response);
                        console.log(response);
                    }) .error(function (error) {
                        deferred.reject(error);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            },
            //获取回帖数据
            getReply: function (postid) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                //ajax请求
                $http.jsonp(ApiEndpoint.url + "post/getreply?postid="+postid+"&callback=JSON_CALLBACK")
                    .success(function (response) {
                        deferred.resolve(response);
                    }) .error(function (error) {
                        deferred.reject(error);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            },
            addReply:function (content,postid) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var PostResult = new Object();
                //ajax请求
                $http.jsonp(ApiEndpoint.url + "post/addreply?appPostReplyFormMap.postid=" + postid + "&appPostReplyFormMap.content=" + content + "&appPostReplyFormMap.userid=" +  localStorage.jininguserid + "&callback=JSON_CALLBACK")
                    .success(function (response) {
                        PostResult = response;
                        if (PostResult.code == 1) {
                            deferred.resolve('回复成功 ');
                        } else {
                            deferred.reject(PostResult.message);
                        }
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            }


        }


    })
    .service('HospitalService', function ($q, $http,ApiEndpoint) {

        return {
            //查询医院
            hospitalView: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var RecordResult = new Object();
                //ajax请求
                $http.jsonp(ApiEndpoint.url + "hospital/get?callback=JSON_CALLBACK")
                    .success(function (response) {
                        RecordResult = response;
                        deferred.resolve(RecordResult);

                    }).error(function(){
                        deferred.reject("数据获取失败");
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            }

        }


    });
