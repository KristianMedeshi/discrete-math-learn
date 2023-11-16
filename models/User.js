const { mongoose, Schema } = require('mongoose');

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
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
