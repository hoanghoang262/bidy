const { model, models, Schema } = require('mongoose');

const conversationSchema = new Schema(
  {
    members: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Conversation =
  models.Conversation || model('Conversation', conversationSchema);
module.exports = Conversation;
