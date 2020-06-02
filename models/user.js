var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
    email: {
        type : String,
        unique: true
    },
    name: String, 
    username: String,
    password : String, 
    isVerified : {
        type: Boolean,
        default: false
    },
    verification : String,
    isBlocked : {
        type: Boolean,
        default : false
    },
    image : String,
    admin : {
        type: Boolean,
        default: false
    },
    github : {
        name : String,
        id : String
        },
}, { timestamps : true
});

userSchema.pre('save', function(next) {
    if(this.password && this.isModified("password")) {
         this.password = bcrypt.hashSync(this.password, 10);
        }
        next();
    });

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);