const Material = require("../models/Material");

exports.addMaterial =
async (req,res) => {

  try {

    const material =
    new Material(req.body);

    await material.save();

    res.json({

      success:true,

      material
    });

  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message
    });
  }
};


exports.getMaterials =
async (req,res) => {

  try {

    const materials =
    await Material.find();

    res.json(materials);

  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message
    });
  }
};


exports.deleteMaterial =
async (req,res) => {

  try {

    await Material.findByIdAndDelete(
      req.params.id
    );

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