import mongoose from "mongoose";


const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  contentUrl: { type: String, required: true },
  contentType: { type: String, enum: ['video', 'pdf'], default: 'video' },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
