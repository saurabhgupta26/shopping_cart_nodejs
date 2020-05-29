var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
    email: {
        type : String,
        unique: true
    },
    name: String, 
    password : String, 
    username: String, 
    facebook : {
        name : String, 
        id : String
    },
    admin : {
        type: Boolean,
        default: false
    },
    github : {
        name : String,
        id : String
        },
    google : {
        name : String,
        id : String
    }, 
    providers : [String]
}, { timestamps : true
});

userSchema.pre('save', function(next) {
    //console.log("inside pre save function")
    if(this.password && this.isModified("password")) {
       // console.log("inside if pre save")
        // bcrypt.hash(this.password, 10, (err, hashed) => {
        //     console.log(hashed,"hashedpassword")
        //     if(err) return next(err);
        //     this.password = hashed;
        //     return next();
        // });
         this.password = bcrypt.hashSync(this.password, 10);
        }
        next();
    });


userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);