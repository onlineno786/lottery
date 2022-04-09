/*
    Services written by - Pankaj tanwar
*/
angular
  .module("userServices", [])

  .factory("user", function ($http) {
    var userFactory = {};

    // get addNewPrize
    userFactory.addNewPrize = function (prizes) {
      return $http.post("/api/prize", prizes);
    };

    userFactory.editPrize = function (prizeId, prizes) {
      return $http.patch("/api/prize/" + prizeId, prizes);
    };

    userFactory.deletePrize = function (prizeId) {
      return $http.delete("/api/prize/" + prizeId);
    };

    userFactory.getPrizes = function (data) {
      if (data && data.prizeId) {
        return $http.get("/api/prize" + "?prizeId=" + data.prizeId);
      } else if (data && data.history) {
        return $http.get("/api/prize" + "?history=1");
      } else {
        return $http.get("/api/prize");
      }
    };

    userFactory.purchase = function ({ prizeId }) {
      return $http.post("/api/prize/" + prizeId + "/purchase");
    };

    // capturePayments
    userFactory.capturePayment = function ({ prizeId }, data) {
      console.log({ data })
      return $http.post("/api/prize/" + prizeId + "/purchase/capture", data);
    };

    userFactory.purchases = function (data) {
      if (data && data.purchaseId) {
        return $http.get(
          "/api/prize/purchases" + "?purchaseId=" + data.purchaseId
        );
      } else {
        return $http.get("/api/prize/purchases");
      }
    };

    // get users
    userFactory.getUsers = function () {
      return $http.get("/api/user");
    };

    // update user details
    userFactory.updateProfile = function (profileData) {
      return $http.patch("/api/user", profileData);
    };

    return userFactory;
  });
