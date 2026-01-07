import TeamMember from "../models/TeamMember.js";
import cloudinary from "../config/cloudinary.js";


// ADD TEAM MEMBER
export const addTeamMember = async (req, res) => {
  try {
    const { name, position, bio } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Team image is required",
      });
    }

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "team" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(req.file.buffer);
    });

    const member = await TeamMember.create({
      name,
      position,
      bio,
      image: {
        url: upload.secure_url,
        publicId: upload.public_id,
      },
    });

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//UPDATE TEAM MEMBER
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, bio } = req.body;

    const member = await TeamMember.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    if (req.file) {
      await cloudinary.uploader.destroy(member.image.publicId);

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "team",
      });

      member.image = {
        url: upload.secure_url,
        publicId: upload.public_id,
      };
    }

    member.name = name ?? member.name;
    member.position = position ?? member.position;
    member.bio = bio ?? member.bio;

    await member.save();

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TEAM MEMBER
export const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    await cloudinary.uploader.destroy(member.image.publicId);
    await member.deleteOne();

    res.json({ message: "Team member deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TEAM MEMBERS
export const getTeamMembersAdmin = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
