import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    icon: { type: String, default: '🔔' },
    read: { type: Boolean, default: false },
    actionUrl: { type: String }
  },
  { timestamps: { createdAt: 'timestamp', updatedAt: false } }
);

notificationSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model('Notification', notificationSchema);
