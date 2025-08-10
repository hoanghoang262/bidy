const { model, models, Schema } = require('mongoose');

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Message = models.Message || model('Message', messageSchema);
module.exports = Message;
