import { v4 } from 'uuid'
import { Schema, Model } from 'mongoose'

const LabelSchema: any = new Schema({
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

const labelModel: any = new Model('Labels', LabelSchema)

export default labelModel
