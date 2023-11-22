const { mongoose, Schema } = require('mongoose');
const getFullPath = require('../utils/getFullPath');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      validate: {
        validator: (value) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value),
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/i.test(value),
        message: () => 'Password must be at least 8 characters long and contain at least one digit, one lowercase, and one uppercase letter.',
      },
    },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    card: {
      number: {
        type: String,
        validate: {
          validator: (value) => /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/.test(value),
          message: (props) => `${props.value} is not a valid card number!`,
        },
      },
      cvv: {
        type: Number,
        validate: {
          validator: (value) => /^\d{3,4}$/.test(value),
          message: (props) => `${props.value} is not a valid CVV!`,
        },
      },
      expiry: {
        type: String,
        validate: {
          validator: (value) => /^(0[1-9]|1[0-2]) \/ \d{2}$/.test(value),
          message: (props) => `${props.value} is not a valid expiry date in MM / YY format!`,
        },
      },
    },
    image: { type: String, default: 'uploads/1700510085788.jpg' },
  },
  {
    toJSON: { virtuals: true },
    virtuals: {
      fullName: {
        get() {
          return `${this.name.first} ${this.name.last}`;
        },
      },
    },
    methods: {
      getInfo(req) {
        return {
          fullName: `${this.name.first} ${this.name.last}`,
          image: getFullPath(req, this.image),
        };
      },
    },
    collection: 'users',
  },
);

module.exports = mongoose.model('User', userSchema);
