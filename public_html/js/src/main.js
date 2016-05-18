/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = angular.module('StarterApp', ['ngMaterial', 'ngAnimate', 'ngMdIcons', 'jkAngularRatingStars',
    'ngCookies', 'ui.bootstrap', 'ngMessages', 'material.svgAssetsCache', 'jkuri.timepicker']);

app.controller('AppCtrl', ['$scope', '$mdBottomSheet','$mdSidenav', '$mdDialog', '$rootScope', '$http',
    function($scope, $mdBottomSheet, $mdSidenav, $mdDialog, $rootScope, $http){
  
  $rootScope.isConnected = false;
  $rootScope.isFoodie = false;
  $rootScope.isRestaurant = false;
  $rootScope.User = {};
  $rootScope.oldComment = {};
  $rootScope.RestaurantComments = {};
  $rootScope.Restaurants = {};
  $rootScope.AllRestaurants = {};
  $rootScope.RestaurantDisches = {};
  $rootScope.RestaurantMenus = {};
  $rootScope.Disches = {};
  $rootScope.Reservations = {};
  $rootScope.UsersWithoutFoodie = {};
  $rootScope.HomeComments = {};
        

    $scope.rate = 3;    
    $scope.max = 5;
    $scope.isReadonly = true;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 200 * (value / $scope.max);
    };

    $scope.ratingStates = [
        {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
        {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'}
    ];
        
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
  
  $http({
      method:'GET',
      url:'http://127.0.0.1:3000/api/commentsHomePage'
  }).then(function successCallback(response) {
      $rootScope.HomeComments = response.data.Comments;
  }, function errorCallback(reponse) {
    alert('Fail to get the home comment.');
  });
  
 $scope.foddies = [
    {
      link : '',
      title: 'Profil',
      icon: 'account_circle'
    },
/*
            {
      link : '',
      title: 'Interests',
      icon: 'reorder'
    },
    */
    {
      link : '',
      title: 'Messages',
      icon: 'message'
    },
    {
        link:'',
        title:'Restaurant',
        icon:'restaurant'
    },
    {
        link:'',
        title:'My reservation',
        icon:'reservation'
    }
  ];
  
  $scope.restaurants = [
      {
      link : '',
      title: 'Profil',
      icon: 'account_circle'
    },
    {
      link : '',
      title: 'Menus',
      icon: 'folder'
    },
    {
      link : '',
      title: 'Disches',
      icon: 'add'
    },
    {
        link : '',
        title: 'Comment',
        icon: 'comment'
    }
  ];
  
  $scope.interests = [
      {
        title   : 'music',
        note    : 3
      },
      {
          title : 'spicy food',
          note  : 0
      },
      {
          title : 'beer',
          note  : 5
      }
  ];
  
  $scope.activity = [
      {
        what: 'Brok',
        who: 'Ali Conners',
        when: '3:08PM',
        notes: "Very good"
      },
      {
        what: 'BBQ',
        who: 'Alex',
        when: '3:08PM',
        notes: "A restaurant not like the others"
      },
      {
        what: 'Macdo',
        who: 'Sandra Adams',
        when: '3:08PM',
        notes: "You must go"
      },
      {
        what: 'PizzaPai',
        who: 'Trevor Hansen',
        when: '3:08PM',
        notes: "strange but good"
      },
      {
        what: 'Memphis',
        who: 'Brian Holt',
        when: '3:08PM',
        notes: "Too much to eat, you don't know where to start."
      }
    ];
    
    
  $scope.alert = '';
  
  $scope.showListBottomSheet = function($event) {
    $scope.alert = '';
    $mdBottomSheet.show({
      template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{item.name}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>',
      controller: 'ListBottomSheetCtrl',
      targetEvent: $event
    }).then(function(clickedItem) {
      $scope.alert = clickedItem.name + ' clicked!';
    });
  };
  
  $scope.foddie = function(item, ev) {
      if (item.title === "Profil")
      {
         $mdDialog.show({
          controller: DialogController,
          templateUrl:'template/profil_foodie.html',
          targetEvent: ev
      });
      }
      /*
      else if (item.title === "Interests") {
          $mdDialog.show({
          controller: DialogController,
          templateUrl:'template/interest_foodie.html',
          targetEvent: ev
      });
      }
      */
      else if (item.title === "Messages") {
          
          $http({
              method:'GET',
              url:'http://127.0.0.1:3000/api/foodies/' + $rootScope.User.FoodieId + '/contacts'
          }).then(function successCallback(reponse) {
              $rootScope.Contacts = reponse.data.Contacts;
              for (var i = 0; i < $rootScope.Contacts.length; i++) {
                  $rootScope.Contacts[i].showMessage = false;
              }
          }, function errorCallback(reponse) {
              alert('Error while get your contacts.');
          });
          
          $http({
              method:'GET',
              url:'http://127.0.0.1:3000/api/foodies/' + $rootScope.User.FoodieId + '/all'
          }).then(function successCallback(response) {
              $rootScope.UsersWithoutFoodie = response.data.Foodies;
          }, function errorCallback(reponse) {
              alert('Error while get the users.');
          });
          
         $mdDialog.show({
          controller: DialogController,
          templateUrl:'template/messages_foodie.html',
          targetEvent: ev
      });
      }
      else if (item.title === "Restaurant") {
          
          $http({
              method:'GET',
              url:'http://127.0.0.1:3000/api/restaurants'
          }).then(function succesCallback(response) {
              $rootScope.AllRestaurants = response.data.Restaurants;
              for (var i = 0; i < $rootScope.AllRestaurants.length; i++) {
                $rootScope.AllRestaurants[i].isCollapsed = false;
                $rootScope.AllRestaurants[i].isCollapsedComment = false;
                $rootScope.AllRestaurants[i].showReservation = false;   
                $rootScope.AllRestaurants[i].showAddComment = false;
             }
          }, function errorCallback(response) {
              alert('Error while getting the restaurants.');
          });
         $mdDialog.show({
          controller: DialogController,
          templateUrl:'template/restaurant_foodie.html',
          targetEvent: ev
      }); 
      }
      else if (item.title === "My reservation") {
          
          $http({
              method:'GET',
              url:'http://127.0.0.1:3000/api/foodie/' + $rootScope.User.FoodieId + '/reservations'
          }).then(function successCallback(response) {
              $rootScope.Reservations = response.data.reservations;
              
          }, function errorCallback(response) {
              alert('Error while getting your reservations.');
          });
          
          $mdDialog.show({
          controller: DialogController,
          templateUrl:'template/foodie_reservation.html',
          targetEvent: ev
      });
  }
  };
  
  $scope.restaurant = function(item,ev) {
    if (item.title === "Profil")
    {
        
        $http({
            method:'GET',
            url:'http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/closeDates'
        }).then(function successCallback(response) {
            $rootScope.User.CloseDates = response.data.CloseDates;
        }, function errorCallback(response) {
            alert('Error while getting your CloseDates.');
        });
        
        $mdDialog.show({
        controller: DialogController,
        templateUrl:'template/profil_restaurant.html',
        targetEvent: ev
        });
    }
    else if (item.title === "Menus")
    {
        $http({
            method:'GET',
            url:'http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/menus'
        }).then(function successCallback(response) {
            $rootScope.RestaurantMenus = response.data.Menus;
            for (var i = 0; i < $rootScope.RestaurantMenus.length; i++) {
                $rootScope.RestaurantMenus[i].isCollapsed = false;
             }
        }, function errorCallback(response) {
            alert('Error while getting your menus.');
        });
        
        $http({
            method:'GET',
            url:'http://127.0.0.1:3000/api/dishes'
        }).then(function successCallback(response) {
            $rootScope.Disches = response.data.Dishes;
        }, function errorCallback(response) {
            alert('Error while getting the dishes.');
        });
        
        $mdDialog.show({
        controller: DialogController,
        templateUrl:'template/menu_restaurant.html',
        targetEvent: ev
        });
    }
    else if (item.title === "Disches")
    {
        $http({
            method:'GET',
            url:'http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/dishes'
        }).then(function successCallback(response) {
            $rootScope.RestaurantDisches = response.data.Dishes;
        }, function errorCallback(response) {
             alert('Error while getting your dishes.');
        });
        
        $http({
            method:'GET',
            url:'http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/dishesNotUsed'
        }).then(function successCallback(response) {
            $rootScope.Disches = response.data.Dishes;
        }, function errorCallback(response) {
            alert('Error while getting the dishes.');
        });
        
        $mdDialog.show({
        controller: DialogController,
        templateUrl:'template/dishes_restaurant.html',
        targetEvent: ev
        });
    }
    else if (item.title === "Comment")
    {
        $http({
            method:'GET',
            url:'http://127.0.0.1:3000/api/restaurant/' + $rootScope.User.RestaurantId + '/comment_restaurants'
        }).then(function successCallback(response) {
            $rootScope.RestaurantComments = response.data.Comment_restaurants;
        }, function errorCallback(response) {
            alert('Error while getting your comments.');
        });
        $mdDialog.show({
        controller: DialogController,
        templateUrl:'template/comments_restaurant.html',
        targetEvent: ev
        });
    }
  },
  
  $scope.registration = function(ev) {
      $mdDialog.show({
          controller: DialogController,
          templateUrl:'template/modal_registration.html',
          targetEvent: ev
      });
  };
  
  $scope.connection = function(ev) {
      $mdDialog.show({
       controller: DialogController,
       templateUrl:'template/modal_connection.html',
       targetEvent: ev
    });
  };
  
  $scope.logout = function() {
      $rootScope.isConnected = false;
      $rootScope.isFoodie = false;
      alert('Logout effectué');
  };
}]);

function DialogController($scope, $mdDialog, $http, $rootScope) {
    $scope.foddieRegistration = {};
    $scope.restaurant = {};
    $scope.comment = {};
    $scope.commentRestaurant ={};
    $scope.commentRestaurant.mark = 3;
    $scope.RestaurantComments = {};
    $scope.updateComment = {};
    $scope.dish = {};
    $scope.add = {};
    $scope.menu = {};
    $scope.addDishes = {};
    $scope.closedDate = {};
    $scope.addReserv = {};
    $scope.sendMessageUser = {};
    $scope.sendMessageCct = {};
    $scope.commentMenu = {};
    $scope.commentMenu.mark = 3;
    $scope.commentDish = {};
    $scope.commentDish.mark = 3;
    $scope.commentDishes = {};
    $scope.commentDishes.mark = 3;
  
    $scope.addCommentDishes = function(restaurantId, dishId) {
        $scope.commentDishes.baseUserId = $rootScope.User.Id;
        $scope.commentDishes._token = $rootScope.User.Token;
        $http({
            method:'POST',
            url:'http://127.0.0.1:3000/api/restaurants/' + restaurantId + '/dishes/' + dishId + '/comments',
            data: $scope.commentDishes
        }).then(function successCallback(response) {
            alert('Your comment is post');
        }, function errorCallback(reponse) {
           alert('Fail to post your comment.'); 
        });
    };
  
    $scope.loadComsDishInMenu = function(restaurantId, dishId, restaurantIndex, menuIndex, index) {
      $http({
          method:'GET',
          url:'http://127.0.0.1:3000/api/restaurants/' + restaurantId + '/dishes/' + dishId + '/comments'
      }).then(function successCallback(response) {
          $rootScope.AllRestaurants[restaurantIndex].Menu[menuIndex].Dish[index].Comment = response.data.Comments;
          $rootScope.AllRestaurants[restaurantIndex].Menu[menuIndex].Dish[index].isCollapsedComment = true;
      }, function errorCallback(reponse) {
         alert('Fail to get the comment');
      });
    };
  
    $scope.addCommentDish = function(restaurantId, dishId) {
        $scope.commentDish.baseUserId = $rootScope.User.Id;
        $scope.commentDish._token = $rootScope.User.Token;
        $http({
            method:'POST',
            url:'http://127.0.0.1:3000/api/restaurants/' + restaurantId + '/dishes/' + dishId + '/comments',
            data: $scope.commentDish
        }).then(function successCallback(response) {
            alert('Your comment is post');
        }, function errorCallback(reponse) {
           alert('Fail to post your comment.'); 
        });
    };
  
    $scope.addCommentMenu = function(restaurantId, menuId) {
        $scope.commentMenu.baseUserId = $rootScope.User.Id;
        $scope.commentMenu._token = $rootScope.User.Token;
        $http({
            method:'POST',
            url:'http://127.0.0.1:3000/api/restaurants/' + restaurantId + '/menus/' + menuId + '/comments',
            data: $scope.commentMenu
        }).then(function successCallback(response) {
            alert('Your comment is post.');
        }, function errorCallback(response) {
           alert('Fail to post your comment.') ;
        });
    };
    
    $scope.addCommentRestaurant = function(id) {
        $scope.commentRestaurant.baseUserId = $rootScope.User.Id;
        $scope.commentRestaurant._token = $rootScope.User.Token;
        $scope.commentRestaurant.restaurantId = id;
        $http({
            method:'POST',
            url:'http://127.0.0.1:3000/api/foodies/' + $rootScope.User.FoodieId + '/comment_restaurants',
            data: $scope.commentRestaurant
        }).then(function successCallback(response) {
            alert('Your comment is post.');
        }, function errorCallback(response) {
           alert('Fail to post your comment.');
        });
        $scope.cancel();
    };
    
    $scope.sendMessageContact = function(id) {
        $scope.sendMessageCct.foodieId = id;
        $scope.sendMessageCct.baseUserId = $rootScope.User.Id;
        $scope.sendMessageCct._token = $rootScope.User.Token;
        $http({
            method:'POST',
            url:'http://127.0.0.1:3000/api/foodies/' + $rootScope.User.FoodieId + '/messages',
            data: $scope.sendMessageCct
        }).then(function successCallback(response) {
            alert('Your message is send.');
        }, function errorCallback(response) {
            alert('Fail to send your message');
        });
        $scope.cancel();
    };
    
    $scope.showMessage = function(id, index) {
      $http({
          method:'GET',
          url:'http://127.0.0.1:3000/api/foodies/' + $rootScope.User.FoodieId + '/contacts/' + id
      }).then(function successCallback(response) {
          $rootScope.Contacts[index].message = response.data.Messages;
          $rootScope.Contacts[index].showMessage = true;
      }, function errorCallback(response) {
          alert('Fail to get your messages');
      });
    };
    
    $scope.sendMessage = function(id) {
        $scope.sendMessageUser.foodieId = id;
        $scope.sendMessageUser.baseUserId = $rootScope.User.Id;
        $scope.sendMessageUser._token = $rootScope.User.Token;
      $http({
          method:'POST',
          url:'http://127.0.0.1:3000/api/foodies/' + $rootScope.User.FoodieId + '/messages',
          data: $scope.sendMessageUser
      }).then(function successCallback(response) {
          alert('Your message is send.');
      }, function errorCallback(reponse) {
          alert('Fail to send your message');
      });
      $scope.cancel();
    };
    
    $scope.deleteReservationFoodie = function(Id) {
        $http.delete('http://127.0.0.1:3000/api/foodies/' + $rootScope.User.FoodieId + '/reservations/' + Id,
        {params: {baseUserId: $rootScope.User.Id, _token: $rootScope.User.Token}}).then(function successCallback(response) {
            alert('The reservation is deleted.');
        }, function errorCallback(response) {
            alert('Fail to delete the dish.');
        });
        $scope.cancel();
    };
    
    $scope.deleteCloseDate = function(Id) {
         $http.delete('http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/closeDates/' + Id,
        {params: {baseUserId: $rootScope.User.Id, _token: $rootScope.User.Token}}).then(function successCallback(response) {
            alert('The dish is deleted.');
        }, function errorCallback(response) {
            alert('Fail to delete the dish.');
        });
        $scope.cancel();
    };
    
    $scope.addCloseDate = function() {
      $scope.closedDate.baseUserId = $rootScope.User.Id;
      $scope.closedDate._token = $rootScope.User.Token;
      
      $http({
         method:'POST',
         url:'http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/closeDates',
         data: $scope.closedDate
      }).then(function successCallback(response) {
          alert('The close date is add to your restaurant.');
      }, function errorCallback(response) {
          alert('Fail to add the close date');
      });
      $scope.cancel();
    };
    
    $scope.restaurantUpdate = function() {
        $rootScope.User.baseUserId = $rootScope.User.Id;
        $rootScope.User._token = $rootScope.User.Token;
        $http({
            method:'PUT',
            url:'http://127.0.0.1:3000/api/users/' + $rootScope.User.Id,
            data: $rootScope.User            
        }).then(function successCallback(response) {
            alert('Your restaurant is updated.');
        }, function errorCallback(response) {
            alert('Fail to update your restaurant.');
        });
        $scope.cancel();
    };
    
    $scope.addReservation = function(id) {
        $scope.addReserv.baseUserId = $rootScope.User.Id;
        $scope.addReserv._token = $rootScope.User.Token;
        $http({
            method:'POST',
            url:'http://127.0.0.1:3000/api/foodies/' + $rootScope.User.FoodieId + '/restaurants/' + id + '/reservations',
            data: $scope.addReserv
        }).then(function successCallback(response) {
            alert('Your reservation is done.');
        }, function errorCallback(response) {
            alert('Fail to add your reservation.');
        });
        $scope.cancel();
    };
    
    $scope.loadComsRestaurant = function(restaurantId, restaurantIndex) {
      $http({
          method:'GET',
          url:'http://127.0.0.1:3000/api/restaurant/' + restaurantId + '/comment_restaurants'
      }).then(function successCallback(response) {
          $rootScope.AllRestaurants[restaurantIndex].Comment = response.data.Comment_restaurants;
          $rootScope.AllRestaurants[restaurantIndex].isCollapsedComment = !$rootScope.AllRestaurants[restaurantIndex].isCollapsedComment;
      }, function errorCallback(response) {
          alert('Fail to load the coms.');
      });
    };
    
    $scope.loadComs = function(restaurantId, restaurantIndex, menuId, menuIndex) {
      $http({
          method:'GET',
          url:'http://127.0.0.1:3000/api/restaurants/' + restaurantId +'/menus/' + menuId + '/comments'
      }).then(function successCallback(response) {
          $rootScope.AllRestaurants[restaurantIndex].Menu[menuIndex].Comment = response.data.Comment_menu;
          $rootScope.AllRestaurants[restaurantIndex].Menu[menuIndex].isCollapsed = !$rootScope.AllRestaurants[restaurantIndex].Menu[menuIndex].isCollapsed;
      }, function errorCallback(response) {
          alert('Fail to load the coms.');
      });
    };
    
    $scope.loadComsDish = function(restaurantId, restaurantIndex, dishId, dishIndex) {
      $http({
         method:'GET',
         url:'http://127.0.0.1:3000/api/restaurants/' + restaurantId + '/dishes/' + dishId + '/comments'
      }).then(function successCallback(response) {
          $rootScope.AllRestaurants[restaurantIndex].Dish[dishIndex].Comment = response.data.Comments;
          $rootScope.AllRestaurants[restaurantIndex].Dish[dishIndex].isCollapsed = !$rootScope.AllRestaurants[restaurantIndex].Dish[dishIndex].isCollapsed;
      }, function errorCallback(response) {
          alert('Fail to load the coms.');
      });
    };
    
    $scope.loadMenus = function(Id, index) {
      $http({
          method:'GET',
          url:'http://127.0.0.1:3000/api/restaurants/' + Id + '/menus'
      }).then(function succesCallback(response) {
          $rootScope.AllRestaurants[index].Menu = response.data.Menus;
          $rootScope.AllRestaurants[index].isCollapsed = !$rootScope.AllRestaurants[index].isCollapsed;
          for (var i = 0; i < $rootScope.AllRestaurants[index].Menu.length; i++) {
            $rootScope.AllRestaurants[index].Menu[i].isCollapsed = false;
            $rootScope.AllRestaurants[index].Menu[i].isCollapsedDish = false;
            for (var y = 0; y < $rootScope.AllRestaurants[index].Menu[i].Dish.length; y++) {
                $rootScope.AllRestaurants[index].Menu[i].Dish[y].isCollapsedComment = false;
            }
          }
      }, function errorCallback(response) {
          alert('Fail to load the menus.');
      });
      
      $http({
          method:'GET',
          url:'http://127.0.0.1:3000/api/restaurants/' + Id + '/dishes'
      }).then(function successCallback(response) {
          $rootScope.AllRestaurants[index].Dish = response.data.Dishes;
          for (var i = 0; i < $rootScope.AllRestaurants[index].Dish.length; i++) {
              $rootScope.AllRestaurants[index].Dish[i].isCollapsed = false;
          }
      }, function errorCallback(response) {
          alert('Fail to load the dishes.');
      });
      
    };
    
    $scope.deleteDish = function(lId) {
        $http.delete('http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/dishes/' + lId,
        {params: {baseUserId: $rootScope.User.Id, _token: $rootScope.User.Token}}).then(function successCallback(response) {
            alert('The dish is deleted.');
        }, function errorCallback(response) {
            alert('Fail to delete the dish.');
        });
        $scope.cancel();
    };
    
    $scope.addMenu = function() {
      $scope.menu.baseUserId = $rootScope.User.Id;
      $scope.menu._token = $rootScope.User.Token;
      $http({
         method:'POST',
         url:'http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/menus',
         data: $scope.menu
      }).then(function successCallback(response) {
          alert('The menu is add to your restaurant.');
      }, function errorCallback(reponse) {
          alert('Fail to add the menu to your restaurant');
      });
      $scope.cancel();
    };
    
    $scope.addDishInMenu = function(menuId) {
      var tmp = {};
      tmp.baseUserId = $rootScope.User.Id;
      tmp._token = $rootScope.User.Token;
      $http({
         method:'POST',
         url:'http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/menus/' + menuId + '/dishes/' + $scope.add.dishId,
         data: tmp
      }).then(function successCallback(response) {
          alert('The dishes add to your menu.');
      }, function errorCallback(response) {
          alert('Fail to add the dish to your menu.');
      });
      $scope.cancel();
    };
    
    $scope.deleteDishInMenu = function(menuId, dishId) {
      $http.delete('http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/menus/' + menuId + '/dishes/' + dishId,
        {params: {baseUserId: $rootScope.User.Id, _token: $rootScope.User.Token}}).then(function successCallback(response) {
            alert('The dish is deleted.');
        }, function errorCallback(response) {
            alert('Fail to delete the dish.');
        });
        $scope.cancel();
    };
    
    $scope.deleteMenu = function(menuId) {
        $http.delete('http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/menus/' + menuId,
        {params: {baseUserId: $rootScope.User.Id, _token: $rootScope.User.Token}}).then(function successCallback(response) {
            alert('The menu is deleted.');
        }, function errorCallback(response) {
            alert('Fail to delete the menu.');
        });
        $scope.cancel();
    };
    
    $scope.addDish = function() {
        $scope.addDishes.baseUserId = $rootScope.User.Id;
        $scope.addDishes._token = $rootScope.User.Token;
      $http({
          method:'POST',
          url:'http://127.0.0.1:3000/api/restaurants/' + $rootScope.User.RestaurantId + '/dishes',
          data: $scope.addDishes
      }).then(function successCallback(response) {
          alert('The dishes is add to your restaurant.');
      }, function errorCallback(response) {
          alert('Fail to add the dish to your restaurant.');
      });
      $scope.cancel();
    };
    
    /*
    $scope.updateRestaurant = function() {
      $http({
          method:'GET',
          url:'http://127.0.0.1:3000/api/restaurant/' + $scope.commentRestaurant.restaurantId + '/comment_restaurants'
      }).then(function successCallback(response) {
          $scope.RestaurantComments = response.data.Comment_restaurants;
      }, function errorCallback(response) {
          alert('Fail to load to comment.');
      });
    };
    */
    $scope.connection = function() {
      $http({
        method:'POST',
        url:'http://127.0.0.1:3000/api/login/',
        data: $scope.foodie
      }).then(function successCallback(response) {
          $rootScope.User = response.data.User;
          $rootScope.isConnected = true;
          if (response.data.User.IsFoodie) {
            $rootScope.isFoodie = true;
            $rootScope.isRestaurant = false;
          }
          else {
            $rootScope.isFoodie = false;
            $rootScope.isRestaurant = true;
          }            
          $scope.cancel();
      }, function errorCallback(response) {
          alert('Connection fail');
      });
    };

    $scope.registration = function() {
        $scope.foddieRegistration.isFoodie = 1;
      $http({
          method:'POST',
          url: 'http://127.0.0.1:3000/api/users',
          data: $scope.foddieRegistration
        }).then(function successCallback(response) {
            $scope.foodie = {};
            $scope.foodie.email = $scope.foddieRegistration.email;
            $scope.foodie.password = $scope.foddieRegistration.password;
            $http({
            method:'POST', 
            url: 'http://127.0.0.1:3000/api/login',
            data: $scope.foodie
        }).then(function successCallback(response) {
            $rootScope.isConnected = true;
            $rootScope.isFoodie = true;
            $rootScope.isRestaurant = false;
            $scope.cancel();
        }, function errorCallback(response) {
            alert('Connection fail status: ' + response.status + ' data: ' + response.data);
        });
  
        }, function errorCallback(response) {
            alert('Registration fail status: ' + response.status + ' data: ' + response.data);
        });
    };

    $scope.registrationRestaurant = function() {
        $scope.restaurant.isFoodie = 0;
        $http({
           method:'POST',
           url: 'http://127.0.0.1:3000/api/users/',
           data: $scope.restaurant
        }).then(function successCallback(response) {
            $scope.restaurantTemps = {};
            $scope.restaurantTemps.email = $scope.restaurant.email;
            $scope.restaurantTemps.password = $scope.restaurant.password;
            $http({
                method:'POST',
                url: 'http://127.0.0.1:3000/api/login/',
                data: $scope.restaurantTemps
            }).then(function successCallback(response) {
                $rootScope.isConnected = true;
                $rootScope.isRestaurant = true;
                $rootScope.isFoodie = false;
                $scope.cancel();
            }, function errorCallback(response) {
                alert('Connection fail status: ' + response.status + ' data: ' + response.data);
            });
        }, function errorCallback(response) {
            alert('Registration fail status: ' + response.status + ' data: ' + response.data);
        });
    };
    
    $scope.foodieUpdate = function() {
        $rootScope.User.baseUserId = $rootScope.User.Id;
        $rootScope.User._token = $rootScope.User.Token;
      $http({
          method:'PUT',
          url: 'http://127.0.0.1:3000/api/users/' + $rootScope.User.Id,
          data: $rootScope.User
      }).then(function successCallback(response) {
          alert('Imformation updated.');
      }, function errorCallback(response) {
          alert('Fail to update your information.');
      });
      $scope.cancel();
    };
    
    $scope.CreateComment = function() {
        var tmp = {};
        tmp.restaurantId = $scope.comment.restaurantId.Id;
        tmp.comment = $scope.comment.comment;
        tmp.mark = $scope.comment.mark.number;
        tmp.baseUserId = $rootScope.User.Id;
        tmp._token = $rootScope.User.Token;
        
        $http({
            method:'POST',
            url:'http://127.0.0.1:3000/api/foodies/' + $rootScope.User.FoodieId + '/comment_restaurants',
            data: tmp
        }).then(function successCallback(response) {
            alert('Your comment is posted.');
        }, function errorCallback(response) {
             alert('Fail to post your comment.');
        });
        $scope.cancel();
    };
    
    $scope.updateFielInOld = function() {
    };
    
    $scope.UpdateComment = function() {
      var tmp = {};
      tmp.restaurantId = $scope.updateComment.comment.RestaurantId;
      tmp.comment = $scope.updateComment.comment.Comment;
      tmp.mark = $scope.updateComment.comment.Mark;
      tmp.baseUserId = $rootScope.User.Id;
      tmp._token = $rootScope.User.Token;
      
      $http({
         method:'PUT',
         url:'http://127.0.0.1:3000/api/foodies/' + $rootScope.User.FoodieId + '/comment_restaurants/' + $scope.updateComment.comment.Id,
         data: tmp
      }).then(function successCallback(response) {
          alert('Your comment is updated.');
      }, function errorCallback(response) {
          alert('Fail to update your comment.');
      });
      $scope.cancel();
    };

    $scope.rate = 3;    
    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 200 * (value / $scope.max);
    };

    $scope.ratingStates = [
        {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
        {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'}
    ];

    $scope.interests = [
      {
        title   : 'music',
        note    : 3
      },
      {
          title : 'spicy food',
          note  : 0
      },
      {
          title : 'beer',
          note  : 5
      }
  ];
  
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
};

app.directive('userAvatar', function() {
  return {
    replace: true,
    template: '<svg class="user-avatar" viewBox="0 0 128 128" height="64" width="64" pointer-events="none" display="block" > <path fill="#FF8A80" d="M0 0h128v128H0z"/> <path fill="#FFE0B2" d="M36.3 94.8c6.4 7.3 16.2 12.1 27.3 12.4 10.7-.3 20.3-4.7 26.7-11.6l.2.1c-17-13.3-12.9-23.4-8.5-28.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.3-1.3-.4-2.7-1.6-3.5-1.4-.9-2.8-1.7-4.2-2.5-7.1-3.9-14.9-6.6-23-7.9-5.4-.9-11-1.2-16.1.7-3.3 1.2-6.1 3.2-8.7 5.6-1.3 1.2-2.5 2.4-3.7 3.7l-1.8 1.9c-.3.3-.5.6-.8.8-.1.1-.2 0-.4.2.1.2.1.5.1.6-1-.3-2.1-.4-3.2-.2-4.4.6-7.5 4.7-6.9 9.1.3 2.1 1.3 3.8 2.8 5.1l11 9.3c1.8 1.5 3.3 3.8 4.6 5.7 1.5 2.3 2.8 4.9 3.5 7.6 1.7 6.8-.8 13.4-5.4 18.4-.5.6-1.1 1-1.4 1.7-.2.6-.4 1.3-.6 2-.4 1.5-.5 3.1-.3 4.6.4 3.1 1.8 6.1 4.1 8.2 3.3 3 8 4 12.4 4.5 5.2.6 10.5.7 15.7.2 4.5-.4 9.1-1.2 13-3.4 5.6-3.1 9.6-8.9 10.5-15.2M76.4 46c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6zm-25.7 0c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6z"/> <path fill="#E0F7FA" d="M105.3 106.1c-.9-1.3-1.3-1.9-1.3-1.9l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.2-3.5-7.3-5.4-11.4-5.7 0 0 .1 0 .1.1l-.2-.1c-6.4 6.9-16 11.3-26.7 11.6-11.2-.3-21.1-5.1-27.5-12.6-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.9 1.4-1.7 2.8-2.6 4.3h109.6c-3.4-7.1-6.5-12.8-8.9-16.9-1.5-2.2-2.6-3.8-3.3-5z"/> <circle fill="#444" cx="76.3" cy="47.5" r="2"/> <circle fill="#444" cx="50.7" cy="47.6" r="2"/> <path fill="#444" d="M48.1 27.4c4.5 5.9 15.5 12.1 42.4 8.4-2.2-6.9-6.8-12.6-12.6-16.4C95.1 20.9 92 10 92 10c-1.4 5.5-11.1 4.4-11.1 4.4H62.1c-1.7-.1-3.4 0-5.2.3-12.8 1.8-22.6 11.1-25.7 22.9 10.6-1.9 15.3-7.6 16.9-10.2z"/> </svg>'
  };
});

app.config(function($mdThemingProvider) {
  var customBlueMap = 		$mdThemingProvider.extendPalette('light-blue', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey');
});
