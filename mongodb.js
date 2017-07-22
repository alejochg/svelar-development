var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Connect to MongoDB 'svelar' hosted by mLabs
mongoose.connect('mongodb://svelar:svelar@dbh74.mlab.com:27747/svelar');

//Defining schema for users likes tracking
const likesSchema = new Schema({
    id_item: Number,
    like_status: String,
    dislike_reason: String
});

const usersSchema = new Schema({
    user_id: Number,
    likes:[likesSchema]
});

const usersActivity = mongoose.model('users_activity', usersSchema);

module.exports = usersActivity;