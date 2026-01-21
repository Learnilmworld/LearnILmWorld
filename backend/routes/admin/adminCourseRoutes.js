import express from "express";
import Course from "../../models/Course.js";

const router = express.Router();

//CREATE course (Admin)
router.post("/", async (req, res) => {
  try {
    const { title, description, thumbnail, videoUrl, pdfUrl } = req.body;



    console.log("REQ.USER =", req.user);

    if (!title || !thumbnail) {
      return res.status(400).json({
        message: "Title and thumbnail are required",
      });
    }

    // Optional: basic base64 sanity check
    if (!thumbnail.startsWith("data:image")) {
      return res.status(400).json({
        message: "Thumbnail must be a base64 image",
      });
    }

    const course = new Course({
      title,
      description,
      thumbnail,        //for now base64 stored directly
      videoUrl: videoUrl || "",
      pdfUrl: pdfUrl || "",
    });


    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ message: "Course creation failed" });
  }
});

//UPDATE course
router.put("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update course" });
  }
});

//DELETE course
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete course" });
  }
});

// GET all courses (Admin)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" })
  }
})


export default router;
