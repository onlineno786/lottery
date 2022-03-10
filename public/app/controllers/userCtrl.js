/*
    Controller written by - Pankaj tanwar
*/
angular
  .module("userCtrl", [
    "userServices",
    "fileModelDirective",
    "uploadFileService",
  ])

  .controller("usersCtrl", function (user) {
    var app = this;

    // get all customers
    user
      .getUsers()
      .then(function (data) {
        app.users = data.data.response.data;
      })
      .catch((error) => {
        app.errorMsg = "Something went wrong, please try again later.";
      });
  })

  .controller("settingsCtrl", function (user, $timeout) {
    var app = this;

    app.profileData = {};

    // update profile
    app.updateProfile = function (mainData) {
      app.profileData.name = mainData.name;
      user
        .updateProfile(app.profileData)
        .then(function (data) {
          app.successMsg = "Your profile has been updated.";
          $timeout(function () {
            app.successMsg = "";
          }, 2000);
        })
        .catch((error) => {
          app.errorMsg = "Oops, something went wrong, please try again.";
        });
    };
  })

  .controller("addPrizeCtrl", function (user) {
    let app = this;
    app.totalPrizes = 0;

    app.addPrizeNow = () => {
      app.totalPrizes += 1;
    };

    app.addNewPrize = (prizeData) => {
      app.errorMsg = false;
      app.loading = true;

      console.log(app.prizeData.prizes);
      if (
        app.prizeData.prizes &&
        Object.keys(app.prizeData.prizes).length > 0
      ) {
        // validate the coupon value
        user
          .addNewPrize(app.prizeData)
          .then((data) => {
            app.loading = false;
            app.successMsg = "Prize added successfully!";
          })
          .catch((error) => {
            app.errorMsg = error.data.response.message;
            app.loading = false;
          });
      } else {
        app.errorMsg = "Empty prize not allowed.";
        app.loading = false;
        console.log(app.errorMsg);
      }
    };
  })

  .controller("prizesCtrl", function (user) {
    let app = this;

    user
      .getPrizes()
      .then((data) => {
        app.loading = false;
        app.prizes = data.data.response.data;
      })
      .catch((error) => {
        app.errorMsg = error.data.response.message;
        app.loading = false;
      });
  })

  .controller("prizeCtrl", function (user, $routeParams) {
    let app = this;

    user
      .getPrizes({ prizeId: $routeParams.prizeId })
      .then((data) => {
        app.loading = false;
        app.prize = data.data.response.data[0];
        console.log(app.prize);
      })
      .catch((error) => {
        app.errorMsg = error.data.response.message;
        app.loading = false;
      });

    // purchase
    app.purchaseNow = () => {
      user
        .purchase({ prizeId: $routeParams.prizeId })
        .then((data) => {
          app.loading = false;
          app.purchase = data.data.response;
        })
        .catch((error) => {
          app.errorMsg = error.data.response.message;
          app.loading = false;
        });
    };
  })

  .controller("resultCtrl", function (user, $routeParams, $scope, $sce) {
    let app = this;
    user
      .purchases({ purchaseId: $routeParams.purchaseId })
      .then((data) => {
        app.loading = false;
        app.purchase = data.data.response.data[0];
      })
      .catch((error) => {
        app.errorMsg = error.data.response.message;
        app.loading = false;
      });
    app.message = {};

    app.spin = (index, yourCode, winnerCode) => {
      app.showSpin = {};

      app.showSpin[index] = true;
    };

    $scope.getIframeSrc = function (code) {
      let val = 'https://622735fd70836fa7aa1585c2--nifty-montalcini-2f52c6.netlify.app?answer=' + code;
      return $sce.trustAsResourceUrl(val);
    };    
  })

  .controller("myPurchasesCtrl", function (user) {
    let app = this;

    user
      .purchases()
      .then((data) => {
        app.loading = false;
        app.purchases = data.data.response.data;
      })
      .catch((error) => {
        app.errorMsg = error.data.response.message;
        app.loading = false;
      });
  });
