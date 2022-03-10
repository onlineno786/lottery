const constant 		= require(__basePath + 'app/core/constant');

module.exports 		= function (app) {
	app.use('/api/monitor', 		require(constant.path.module + 'monitor/index.js').router);
	app.use('/api/user', 			require(constant.path.module + 'user/index.js').router);
	app.use('/api/prize', 			require(constant.path.module + 'prize/index.js').router);
};