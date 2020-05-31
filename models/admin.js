var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var adminSchema = new Schema ({
    email: {
        type : String,
        unique: true
    },
    name: {
        type : String, 
        required : true
    },
    password :{
        type : String, 
        required : true
    }, 
    username: {
        type : String, 
        required : true
    }, 
    admin : {
        type: Boolean,
        default: true
    },
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
    providers : [String]
}, { timestamps : true
});

adminSchema.pre('save', function(next) {
    if(this.password && this.isModified("password")) {
         this.password = bcrypt.hashSync(this.password, 10);
        }
        next();
    });


adminSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);