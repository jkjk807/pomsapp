const mongoose = require("mongoose");

const ParcelSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    sender: {
      type: String,
      validate: {
        validator: function (aSender) {
          return aSender.length >= 3;
        },
        message: "Sender need to be longer than 3 characters",
      },
    },
    address: {
      type: String,
      validate: {
        validator: function (aAddress) {
          return aAddress.length >= 3;
        },
        message: "Address need to be longer than 3 characters",
      },
    },
    weight: Number,
    fragile:Boolean,
    cost:Number
  });

module.exports = mongoose.model("Parcel", ParcelSchema);