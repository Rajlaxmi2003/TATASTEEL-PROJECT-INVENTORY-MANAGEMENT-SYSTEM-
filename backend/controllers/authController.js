const User = require("../models/User");

const bcrypt = require("bcryptjs");

exports.register = async (req,res) => {

  try {

    const existingUser =
    await User.findOne({

      username:req.body.username
    });

    if(existingUser){

      return res.status(400).json({

        success:false,

        message:
        "Username already exists"
      });
    }

    const hash = await bcrypt.hash(
      req.body.password,
      10
    );

    const totalUsers =
    await User.countDocuments();

    let role = "user";

    if(totalUsers === 0){

      role = "admin";
    }

    const user = new User({

      name:req.body.name,

      username:req.body.username,

      password:hash,

      role
    });

    await user.save();

    res.json({

      success:true,

      message:
      `Registered as ${role}`
    });

  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message
    });
  }
};


exports.login = async (req,res) => {

  try {

    const {
      username,
      password
    } = req.body;

    const user =
    await User.findOne({ username });

    if(!user){

      return res.status(400).json({

        success:false,

        message:"User not found"
      });
    }

    const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

    if(!isMatch){

      return res.status(400).json({

        success:false,

        message:"Wrong Password"
      });
    }

    user.isLoggedIn = true;

    await user.save();

    res.json({

      success:true,

      user
    });

  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message
    });
  }
};


exports.logout = async (req,res) => {

  try {

    const { username } = req.body;

    const user =
    await User.findOne({ username });

    if(user){

      user.isLoggedIn = false;

      await user.save();
    }

    res.json({

      success:true
    });

  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message
    });
  }
};


exports.changePassword =
async (req,res) => {

  try {

    const {
      username,
      password
    } = req.body;

    const user =
    await User.findOne({ username });

    if(!user){

      return res.status(404).json({

        success:false,

        message:"User not found"
      });
    }

    const hash =
    await bcrypt.hash(password,10);

    user.password = hash;

    await user.save();

    res.json({

      success:true,

      message:
      "Password Changed"
    });

  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message
    });
  }
};


exports.getLoggedEmployees =
async (req,res) => {

  try {

    const users = await User.find({

      isLoggedIn:true,

      role:"user"

    }).select("name username");

    res.json({

      success:true,

      users
    });

  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message
    });
  }
};