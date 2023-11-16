const { mongoose, Schema } = require('mongoose');

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
      name: {
        first: { type: String },
        last: { type: String },
      },
      number: {
        type: Number,
        validate: {
          validator: (value) => /^\d{16}$/.test(value),
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
  },
  {
    virtuals: {
      fullName: {
        get() {
          return `${this.name.first} ${this.name.last}`;
        },
      },
    },
    collection: 'users',
  },
);

module.exports = mongoose.model('User', userSchema);
