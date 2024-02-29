import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

export interface User extends mongoose.Document {
  username: string;
  email: string;
  password: string;
}
