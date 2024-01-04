const Resource = require('../models/resourceModel');
const Student = require('../models/studentModel');

exports.reserveResource = async (req, res) => {
  try {
    const { resourceId, studentId, startTime, endTime } = req.body;

    // Check resource availability
    const resource = await Resource.findById(resourceId);
    if (!resource || !resource.isAvailable) {
      return res
        .status(400)
        .json({ message: 'Resource not available for reservation' });
    }

    // Check student existence
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(400).json({ message: 'Student not found' });
    }

    // Create reservation
    resource.reservations.push({ studentId, startTime, endTime });
    resource.isAvailable = false;
    await resource.save();

    res
      .status(200)
      .json({
        message: 'Resource reserved successfully',
        reservation: resource.reservations,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
