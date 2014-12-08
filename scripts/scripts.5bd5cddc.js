"use strict";var app=angular.module("rentify",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","LocalStorageModule","angular-loading-bar","services.config","toastr"]);app.config(["$httpProvider",function(a){a.interceptors.push("authInterceptorService")}]),app.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html"}).when("/login",{templateUrl:"views/login.html",controller:"loginController"}).when("/signup",{templateUrl:"views/signup.html",controller:"signupController"}).when("/mysites",{templateUrl:"views/mysites.html",controller:"mysitesController"}).when("/addsite",{templateUrl:"views/addsite.html",controller:"addSiteController"}).when("/deletesite",{templateUrl:"views/deletesite.html",controller:"deletesiteController"}).otherwise({redirectTo:"/"})}]),angular.module("services.config",[]).constant("configuration",{serverBaseUri:"http://rentifywebapidev01.azurewebsites.net/",clientId:"rentifyAngularMainApp",environment:"DEV"}),console.log("running app-run"),app.run(["authService",function(a){a.fillAuthData()}]),app.factory("authService",["$q","$injector","$location","localStorageService","configuration",function(a,b,c,d,e){console.log("configuration: "+e);var f,g=e.serverBaseUri,h={},i={isAuth:!1,userName:"",useRefreshTokens:!1},j={provider:"",userName:"",email:"",externalAccessToken:""},k=function(a){return n(),f=f||b.get("$http"),f.post(g+"api/account/register",a).then(function(a){return a})},l=function(){console.log("checking if user is authenticated... ["+g+"]"),i.isAuth||(console.log("user is not authenticated, redirecting to login view."),c.path("login"))},m=function(a){var c="grant_type=password&username="+a.userName+"&password="+a.password;return a.useRefreshTokens&&(c=c+"&client_id="+e.clientId),f=f||b.get("$http"),console.log("about to post to:"+g+"token"),f.post(g+"token",c,{headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(b){a.useRefreshTokens?d.set("authorizationData",{token:b.access_token,userName:a.userName,refreshToken:b.refresh_token,useRefreshTokens:!0}):d.set("authorizationData",{token:b.access_token,userName:a.userName,refreshToken:"",useRefreshTokens:!1}),i.isAuth=!0,i.userName=a.userName,i.useRefreshTokens=a.useRefreshTokens}).error(function(a,b,c,d){console.log("Error encountered logging in (authService):",a,b,d),n()})},n=function(){d.remove("authorizationData"),i.isAuth=!1,i.userName="",i.useRefreshTokens=!1},o=function(){var a=d.get("authorizationData");a&&(i.isAuth=!0,i.userName=a.userName,i.useRefreshTokens=a.useRefreshTokens)},p=function(){var c=a.defer(),h=d.get("authorizationData");if(h&&h.useRefreshTokens){var i="grant_type=refresh_token&refresh_token="+h.refreshToken+"&client_id="+e.clientId;d.remove("authorizationData"),f=f||b.get("$http"),f.post(g+"token",i,{headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(a){d.set("authorizationData",{token:a.access_token,userName:a.userName,refreshToken:a.refresh_token,useRefreshTokens:!0}),c.resolve(a)}).error(function(){c.reject()})}else c.reject();return c.promise},q=function(a){return f=f||b.get("$http"),f.get(g+"api/account/ObtainLocalAccessToken",{params:{provider:a.provider,externalAccessToken:a.externalAccessToken}}).success(function(a){d.set("authorizationData",{token:a.access_token,userName:a.userName,refreshToken:"",useRefreshTokens:!1}),i.isAuth=!0,i.userName=a.userName,i.useRefreshTokens=!1}).error(function(){n()})},r=function(a){return f=f||b.get("$http"),f.post(g+"api/account/registerexternal",a).success(function(a){d.set("authorizationData",{token:a.access_token,userName:a.userName,refreshToken:"",useRefreshTokens:!1}),i.isAuth=!0,i.userName=a.userName,i.useRefreshTokens=!1}).error(function(){n()})};return h.saveRegistration=k,h.login=m,h.logOut=n,h.fillAuthData=o,h.authentication=i,h.refreshToken=p,h.obtainAccessToken=q,h.externalAuthData=j,h.registerExternal=r,h.redirectToLoginIfNotAuthenticated=l,h}]),app.factory("authInterceptorService",["$q","$location","$injector","localStorageService",function(a,b,c,d){var e,f={},g=function(a){a.headers=a.headers||{};var b=d.get("authorizationData");return b&&(a.headers.Authorization="Bearer "+b.token),a},h=function(d){var e=a.defer();if(401===d.status){var f=c.get("authService");f.refreshToken().then(function(){i(d.config,e)},function(){f.logOut(),b.path("/login"),e.reject(d)})}else e.reject(d);return e.promise},i=function(a,b){e=e||c.get("$http"),e(a).then(function(a){b.resolve(a)},function(a){b.reject(a)})};return f.request=g,f.responseError=h,f}]),app.factory("tokensManagerService",["$http","configuration",function(a,b){var c=b.serverBaseUri,d={},e=function(){return a.get(c+"api/RefreshTokens").then(function(a){return a})},f=function(b){return a.delete(c+"api/refreshtokens/?tokenid="+b).then(function(a){return a})};return d.deleteRefreshTokens=f,d.getRefreshTokens=e,d}]),function(){function a(a,b,c){function d(){return a.post(j+"api/mysites").success(function(a){return console.log("Returning results from mysitesService: ",a),a})}function e(b){return a.post(j+"api/mysites/add",b)}function f(b){return a.delete(j+"api/mysites/delete?uniqueId="+b)}function g(a){i=a}function h(){return i}b.redirectToLoginIfNotAuthenticated();var i,j=c.serverBaseUri,k={};return k.getMySites=d,k.addSite=e,k.deleteSite=f,k.setSiteSelectedForDeletion=g,k.getSiteSelectedForDeletion=h,k}app.factory("sitesService",["$http","authService","configuration",a])}(),function(){function a(a){function b(){return(new Date).toUTCString()}var c={positionClass:"toast-bottom-right"},d={};return d.info=function(d){a.info(d,b(),c)},d.error=function(d){a.error(d,b(),c)},d.success=function(d){a.success(d,b(),c)},d.warning=function(d){a.warning(d,b(),c)},d}angular.module("rentify").factory("notificationService",["toastr",a])}(),function(){function a(a,b,c,d){var e={};e.environment=d.environment,e.logOut=function(){c.logOut(),b.path("/home")},e.authentication=c.authentication,a.vm=e}app.controller("indexController",["$scope","$location","authService","configuration",a])}(),app.controller("loginController",["$scope","$location","configuration","authService",function(a,b,c,d){var e={},f=c.serverBaseUri,g=c.clientId;e.loginData={userName:"",password:"",useRefreshTokens:!1},e.message="",e.login=function(){console.log("entering login function"),d.login(e.loginData).success(function(){b.path("/mysites")}).error(function(a,b,c,d){console.log("Error encountered logging in:",a,b,d),e.message=a.error_description})},e.authExternalProvider=function(b){var c=location.protocol+"//"+location.host+"/authcomplete.html",d=f+"api/Account/ExternalLogin?provider="+b+"&response_type=token&client_id="+g+"&redirect_uri="+c;window.$windowScope=a;window.open(d,"Authenticate Account","location=0,status=0,width=600,height=750")},a.authCompletedCB=function(c){a.$apply(function(){if("False"==c.haslocalaccount)console.log("external account is not linked to a local account, linking..."),d.logOut(),d.externalAuthData={provider:c.provider,userName:c.external_user_name,email:c.external_email,externalAccessToken:c.external_access_token},a.registerData={userName:d.externalAuthData.email,email:d.externalAuthData.email,provider:d.externalAuthData.provider,externalAccessToken:d.externalAuthData.externalAccessToken},console.log("about to post registerData: ",a.registerData),d.registerExternal(a.registerData).success(function(){b.path("/orders")}).error(function(a,b,c,d){console.log("Error encountered associating external login with local app account:",a,b,d),e.message=a.error_description});else{console.log("external account is linked to a local account, logging in...");var f={provider:c.provider,externalAccessToken:c.external_access_token};d.obtainAccessToken(f).then(function(){b.path("/orders")},function(a,b,c,d){console.log("Error encountered logging in (authCompletedCB): ",a,b,d),e.message=a.error_description})}})},a.vm=e}]),app.controller("signupController",["$scope","$location","$timeout","authService",function(a,b,c,d){var e={};e.savedSuccessfully=!1,e.message="",e.registration={userName:"",email:"",password:"",confirmPassword:""},e.signUp=function(){d.saveRegistration(e.registration).then(function(){e.savedSuccessfully=!0,e.message="User has been registered successfully, you will be redirected to login page in 2 seconds.",f()},function(a){var b=[];for(var c in a.data.modelState)for(var d=0;d<a.data.modelState[c].length;d++)b.push(a.data.modelState[c][d]);e.message="Failed to register user due to:"+b.join(" ")})};var f=function(){var a=c(function(){c.cancel(a),b.path("/login")},2e3)};a.vm=e}]),function(){function a(a,b,c,d){function e(a){console.log(a),d.setSiteSelectedForDeletion(a),b.path("deletesite")}c.redirectToLoginIfNotAuthenticated();var f={};f.sites=[],f.message="",f.getSites=function(){d.getMySites().success(function(a){f.sites=a}).error(function(a,b,c,d){console.log("Getting MySites failed: ",a,b,d),f.message="Getting My Sites failed. "+(a.message?a.message:"")})},f.deleteSite=e,f.getSites(),a.vm=f}app.controller("mysitesController",["$scope","$location","authService","sitesService",a])}(),function(){function a(a,b,c,d,e){c.redirectToLoginIfNotAuthenticated();var f={};f.message="",f.site={name:"",uniqueId:""},f.addSite=function(){d.addSite(f.site).success(function(){e.success("New site ["+f.site.name+"] successully added."),b.path("mysites")}).error(function(a,b,c,d){console.log("Adding new site failed: ",a,b,d),f.message="Adding new site failed. "+(a.message?a.message:"")})},a.vm=f}app.controller("addSiteController",["$scope","$location","authService","sitesService","notificationService",a])}(),function(){function a(a,b,c,d,e){c.redirectToLoginIfNotAuthenticated();var f={};f.message="",f.site=d.getSiteSelectedForDeletion(),f.site||b.path("mysites"),f.cancel=function(){d.setSiteSelectedForDeletion({}),b.path("mysites")},f.deleteSite=function(){d.deleteSite(f.site.uniqueId).success(function(){e.success("The site: "+f.site.name+" was successully deleted."),f.cancel()}).error(function(a,b,c,d){console.log("Error encountered deleting site:",a,b,d),f.message=a.error_description})},a.vm=f}app.controller("deletesiteController",["$scope","$location","authService","sitesService","notificationService",a])}();