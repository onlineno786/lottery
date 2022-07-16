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

    // move prize to history
    app.movePrize = (prizeId) => {
      console.log("prize movei.");
      user
        .editPrize(prizeId, { history: true })
        .then((data) => {
          getPrizes();
          console.log("moved to history.");
        })
        .catch((error) => {
          app.errorMsg = error.data.response.message;
          app.loading = false;
        });
    };

    function getPrizes() {
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
    }

    getPrizes();

    app.wantDelete = {};

    // want to delete prize
    app.wantToDelete = (index) => {
      app.wantDelete = {};
      app.wantDelete[index] = true;
    };
    // delete prize
    app.deletePrize = (prizeId) => {
      console.log(prizeId);
      user
        .deletePrize(prizeId)
        .then((data) => {
          getPrizes();
        })
        .catch((error) => {
          getPrizes();
        });
    };
  })

  .controller("historyCtrl", function (user) {
    let app = this;

    function getPrizes() {
      user
        .getPrizes({ history: true })
        .then((data) => {
          app.loading = false;
          app.prizes = data.data.response.data;
        })
        .catch((error) => {
          app.errorMsg = error.data.response.message;
          app.loading = false;
        });
    }

    getPrizes();

    app.wantDelete = {};

    // want to delete prize
    app.wantToDelete = (index) => {
      app.wantDelete = {};
      app.wantDelete[index] = true;
    };
    // delete prize
    app.deletePrize = (prizeId) => {
      console.log(prizeId);
      user
        .deletePrize(prizeId)
        .then((data) => {
          getPrizes();
        })
        .catch((error) => {
          getPrizes();
        });
    };
  })

  .controller("prizeCtrl", function (user, $routeParams) {
    let app = this;

    user
      .getPrizes({ prizeId: $routeParams.prizeId })
      .then((data) => {
        app.loading = false;
        app.prize = data.data.response.data[0];
      })
      .catch((error) => {
        app.errorMsg = error.data.response.message;
        app.loading = false;
      });

    function loadScript(src) {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    }

    // purchase
    app.purchaseNow = () => {
      user
        .purchase({ prizeId: $routeParams.prizeId })
        .then(async (data) => {
          console.log(data);
          app.loading = false;
          app.purchase = data.data.response.data;

          if(app.purchase.razorpay === true) {
            const res = await loadScript(
                "https://checkout.razorpay.com/v1/checkout.js"
            );
    
            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
            }

            let order     = app.purchase;
            let userInfo  = data.data;
            const options = {
                key         : "rzp_live_K8EcbcjMSzgGBf",
                amount      : order.amount.toString(),
                currency    : order.currency,
                name        : 'Drealfull-fill User',
                description : order.receipt,
                order_id    : order.id,
                handler     : async function (response) {
                    const resp = {
                        razorpayPaymentId   : response.razorpay_payment_id,
                        razorpayOrderId     : response.razorpay_order_id,
                        razorpaySignature   : response.razorpay_signature,
                        amount              : order.amount.toString()
                    };

                    user.capturePayment({ prizeId: $routeParams.prizeId }, resp).then(function(data) {
                        if(data.data.status) {
                            // show success message!
                            app.successMsg = true;
                        } else {
                            // show some error message!
                            app.paymentErrorMsg        = 'Payment failed.';
                        }
                    })
                },
                prefill     : {
                    name    : 'Drealfull-fill User',
                },
                notes       : {
                    address : "Dream fullfill",
                },
                theme       : {
                    color   : "#61dafb",
                },
            };
    
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();



          } else {
            app.successMsg = 'Congratulations!!!!! You have purchased the ticket. Go to my tickets section to see your code.'
          }
        })
        .catch((error) => {
          app.errorMsg = error.data.response.message;
          app.loading = false;
        });
    };
  })

  .controller("editPrizeCtrl", function (user, $routeParams) {
    let app = this;

    app.totalPrizes = 0;

    app.addPrizeNow = () => {
      app.totalPrizes += 1;
    };

    user
      .getPrizes({ prizeId: $routeParams.prizeId })
      .then((data) => {
        app.loading = false;
        app.prizeData = data.data.response.data[0];
        app.prizeData.prizes.forEach((prize, index) => {
          app.prizeData.prizes[index].date = new Date(prize.date);
        });
        app.totalPrizes = app.prizeData.prizes.length;
      })
      .catch((error) => {
        console.log(error);
        app.errorMsg = error.data.response.message;
        app.loading = false;
      });

    // updated prize
    app.editPrize = (prizeData) => {
      app.errorMsg = false;
      app.loading = true;

      console.log(app.prizeData.prizes);
      if (app.prizeData.prizes && app.prizeData.prizes.length > 0) {
        // validate the coupon value
        user
          .editPrize($routeParams.prizeId, app.prizeData)
          .then((data) => {
            app.loading = false;
            app.successMsg = "Prize updated successfully!";
          })
          .catch((error) => {
            app.errorMsg = error.data.response.message;
            app.loading = false;
          });
      } else {
        app.errorMsg = "Empty prize not allowed.";
        app.loading = false;
      }
    };
  })

  .controller(
    "resultCtrl",
    function (user, $routeParams, $scope, $sce, $interval) {
      let app = this;

      $scope.isAllowedToSeeResult = (date) => {
        return new Date(date) <= new Date();
      };

      // timers
      app.timer = {};

      function msToTime(duration) {
        let seconds = Math.floor((duration / 1000) % 60);

        let minutes = Math.floor((duration / (1000 * 60)) % 60);

        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        let days = Math.floor(duration / (1000 * 60 * 60 * 24));
        days = days < 10 ? "0" + days : days;

        hours = hours < 10 ? "0" + hours : hours;

        minutes = minutes < 10 ? "0" + minutes : minutes;

        seconds = seconds < 10 ? "0" + seconds : seconds;
        return (
          days +
          " days, " +
          hours +
          " hours, " +
          minutes +
          " minutes, " +
          seconds +
          " seconds."
        );
      }

      function timer(date, index) {
        const diff = new Date(date) - new Date();
        app.timer[index] = msToTime(diff);
      }

      user
        .purchases({ purchaseId: $routeParams.purchaseId })
        .then((data) => {
          app.loading = false;
          app.purchase = data.data.response.data[0];
          let prize = app.purchase.prize;
          // if data is there
          prize.prizes.forEach((data, index) => {
            $interval(function () {
              timer(data.date, index);
            }, 1000); //1000 == 1 second.
          });
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
        let val = "https://nifty-montalcini-2f52c6.netlify.app?answer=" + code;
        return $sce.trustAsResourceUrl(val);
      };
    }
  )

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
  })

  .controller("settingsCtrl", function (user, $timeout) {
    var app = this;

    app.profileData = {};

    // update profile
    app.updateProfile = function (mainData) {
      app.profileData.name = mainData.name;
      app.profileData.address = mainData.address;
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
  });
