import { v4 } from 'uuid'
import { Schema, model } from 'mongoose'

interface ILabel {
  id: string;
  title: string;
  color: string;
  updatedAt: any;
  createdAt: any;
}

const LabelSchema: any = new Schema<ILabel>({
  id: {
    type: String,
    default: v4()
  },
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const LabelModel: any = model<ILabel>('Labels', LabelSchema)

export default LabelModel
