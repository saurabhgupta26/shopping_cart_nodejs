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
    providers : [String]
}, { timestamps : true
});

adminSchema.pre('save', function(next) {
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


adminSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);