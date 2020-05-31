var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema ({
    image : String,
    name: {
        type : String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    catgory: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        min: 0,
        default : 0
    },
    description: {
        type: String,
        required: true
    },
    reviews : [{
    type: Schema.Types.ObjectId,
    ref: "Admin"
}]
}, { timestamps : true
});

module.exports = mongoose.model('Product', productSchema);