const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  console.log('Received signup data:', req.body);
  const { name, email, password, role, companyname } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (role === 'seller' && !companyname) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === 'seller' && { companyname }),
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, 'hello');
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login',async function(req,res){
  const {email,password}=req.body;
  try{
    const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({message:'user not found'});
    }
    const ismatch=await bcrypt.compare(password,user.password);
    if(!ismatch){
      return res.status(400).json({message:'invalid credentials'});
    }
    const token=jwt.sign({id:user._id,role:user.role},'hello');
     res.status(200).json({ message: 'Login successful', token, role: user.role });

  }
  catch(error){
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
