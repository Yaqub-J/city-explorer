import mongoose, { Schema, Document } from 'mongoose';
import crypto from "crypto";

interface UserAttributes {
  username: string;
  email: string;
  password: string;
  role: string;
  passwordResetToken: string;
  passwordResetTokenExpires: Date;
  userMessages: string[];
  botReplies: string[];
}

interface UserDocument extends UserAttributes, Document {
  createResetPasswordToken(): string;
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'business'], default: 'user' },
  passwordResetToken: {type: String},
  passwordResetTokenExpires: { type: Date },
  userMessages: { type: [String], default: [] },
  botReplies: { type: [String], default: [] },
  // createResetPasswordToken(): { type: string },
});


userSchema.methods.createResetPasswordToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken, this.passwordResetToken);
  return resetToken; 
};


const User = mongoose.model<UserDocument>('User', userSchema );

export default User;

