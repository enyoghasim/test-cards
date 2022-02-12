import { v4 } from 'uuid'
import { Schema, model } from 'mongoose'

interface ILabel {
  id: string;
  title: string;
  color: string;
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
  }
})

const labelModel: any = model<ILabel>('Labels', LabelSchema)

export default labelModel
