import { Job, Webinar,Guide } from "../models/CareerCell.js";

// ✅ Add Job / Internship
export const addJob = async (req, res) => {
  try {
    const { title, company, description, eligibility, location, salary, mode, tags, deadline } = req.body;

    const job = new Job({
      title,
      company,
      description,
      eligibility,
      location,
      salary,
      mode,
      tags,
      deadline,
      postedBy: req.user.id, // Career Cell user
    });

    await job.save();
    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get All Jobs (Student & Admin)
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Student Apply Job
// export const applyJob = async (req, res) => {
//   try {
//     const { jobId, resumeLink } = req.body;
//     const job = await Job.findById(jobId);

//     if (!job) return res.status(404).json({ success: false, message: "Job not found" });

//     job.applicants.push({ student: req.user.id, resumeLink });
//     await job.save();

//     res.json({ success: true, message: "Applied successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Export Applicants CSV
// export const exportApplicants = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id).populate("applicants.student", "name email");

//     if (!job) return res.status(404).json({ success: false, message: "Job not found" });

//     const csvWriter = createObjectCsvWriter({
//       path: "applicants.csv",
//       header: [
//         { id: "name", title: "Name" },
//         { id: "email", title: "Email" },
//         { id: "resume", title: "Resume" },
//       ],
//     });

//     const records = job.applicants.map(a => ({
//       name: a.student.name,
//       email: a.student.email,
//       resume: a.resumeLink,
//     }));

//     await csvWriter.writeRecords(records);
//     res.download("applicants.csv");
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ✅ Add Webinar
export const addWebinar = async (req, res) => {
  try {
    const { title, speaker, datetime, mode, link } = req.body;

    const webinar = new Webinar({
      title,
      speaker,
      datetime,
      mode,
      link,
      createdBy: req.user.id,
    });

    await webinar.save();
    res.status(201).json({ success: true, webinar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get All Webinars
export const getWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find().sort({ datetime: -1 });
    res.json({ success: true, webinars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



 

// ✅ Add Guide
export const addGuide = async (req, res) => {
  try {
    const { title, category, status } = req.body;

    const guide = new Guide({
      title,
      category,
      status,
      createdBy: req.user.id, // Career Cell sub-admin
    });

    await guide.save();
    res.status(201).json({ success: true, guide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get All Guides
export const getGuides = async (req, res) => {
  try {
    const guides = await Guide.find().sort({ createdAt: -1 });
    res.json({ success: true, guides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================== Get Jobs by Mode ==================
export const getJobsByMode = async (req, res) => {
  try {
    const { mode } = req.params;

    // validate against allowed values
    const allowedModes = ["Full-time", "Part-time", "Internship", "Remote", "Onsite"];

    if (!allowedModes.includes(mode)) {
      return res.status(400).json({
        success: false,
        message: `Invalid mode. Allowed values: ${allowedModes.join(", ")}`
      });
    }

    const jobs = await Job.find({ mode }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error("Error fetching jobs by mode:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching jobs by mode"
    });
  }
};


export const deletejobbyId = async (req, res) => {
  try{
    const{id}= req.params;
    const job = await job.findbyIdAndDelete(id);
    if(!job){
      return res.status(404).json({success:false, message:"Job not found"});
    }
    res.status(200).json({success:true, message:"Job deleted successfully"});
  }
catch(err){
  res.status(500).json({success:false, message:err.message});
}

}

export const deletewebinarbyId = async (req, res) => {
  try{
    const{id}= req.params;
    const webinar = await Webinar.findByIdAndDelete(id);
    if(!webinar){
      return res.status(404).json({success:false, message:"Webinar not found"});
    }
    res.status(200).json({success:true, message:"Webinar deleted successfully"});
  }
catch(err){
  res.status(500).json({success:false, message:err.message});
}
}

export const deleteguidebyId = async (req, res) => {
  try{
    const{id}= req.params;
    const guide = await Guide.findByIdAndDelete(id);
    if(!guide){
      return res.status(404).json({success:false, message:"Guide not found"});
    }
    res.status(200).json({success:true, message:"Guide deleted successfully"});
  }
catch(err){
  res.status(500).json({success:false, message:err.message}); 
}
}
