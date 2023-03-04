const { MONGOOSE_DB = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
module.exports.mongoDb = MONGOOSE_DB;
