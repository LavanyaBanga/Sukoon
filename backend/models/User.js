const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 60,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },

    avatar: {
      type: String,
      default: '',
    },

    preferences: {
      focusAreas: [{ type: String }],

      strugglesMostAt: {
        type: String,
        enum: [
          'Morning',
          'Afternoon',
          'Evening',
          'Late night',
          '',
        ],
        default: '',
      },

      copingStyles: [{ type: String }],
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    trustedContacts: [
      {
        name: String,
        phone: String,
        relation: String,
      },
    ],

    settings: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },

      backgroundMusic: {
        type: Boolean,
        default: true,
      },

      reduceAnimations: {
        type: Boolean,
        default: false,
      },
    },

    achievements: [{ type: String }],

    lastCheckIn: {
      type: Date,
    },

    streak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


// Password hashing
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});


// Compare login password
userSchema.methods.matchPassword = async function (
  enteredPassword
) {
  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};


module.exports = mongoose.model(
  'User',
  userSchema
);