import { Schema, Model } from 'mongoose';
import { v4 } from 'uuid';

const TaskSchema: any = new Schema({
  id: {
    type: String,
    default: v4(),
  },
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const taskModel: any = new Model('Boards', TaskSchema);

export default taskModel;
