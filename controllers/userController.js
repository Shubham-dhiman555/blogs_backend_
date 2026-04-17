const { where } = require("sequelize");
const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const useralready = await db.User.findOne({ where: { email: email } })
    if (!useralready) {
      const user = await db.User.create({ username, email, password: hashedPassword });
      // alert("user created sucessfully")
      return res.status(201).json({ message: 'user created sucessfully' })
    }
    else {
      // alert("user already exists")
      return res.status(409).json({ message: 'user already exists' })
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    // console.log(user)

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);

    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials wrong password' });
    const token = jwt.sign(
      { id: user.id, role: user.role },   // payload
      process.env.JWT_SECRET_KEY,             // secret key
      { expiresIn: '1d' }
    );
    // console.log(token)
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {

    const userId = req.user.id;

    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      data: user
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

const getUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const user = await db.User.findByPk(id, { attributes: ['id', 'username'] })
    // console.log(user);
    if (user.length == 0) {
      return res.status(404).json({ error: "No users found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
// const deleteUser = async (req, res) => {
//   try {
//     const user = await db.User.findByPk(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     await user.destroy();
//     return res.status(200).json({ message: "User deleted" });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

// const updateUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const user = await db.User.findByPk(req.params.id);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     await user.update(
//       {
//         username: username,
//         email: email,
//         password: password
//       }
//     )
//     res.status(200).json({
//       message: "user updated successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

const getuserblog = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id)
    const user = await db.User.findByPk(id, {
      include:
        [{ model: db.blog }]
    }
    );
    // console.log(category)
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({
      message: "users Blogs fetched successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const blogsLikeByUser = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await db.User.findByPk(id, {
      include: [
        {
          model: db.likes,
          include: [
            {
              model: db.blog,
              attributes: ['id', 'title']
            }
          ]
        }
      ]
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User likes fetched successfully',
      data: user.likes
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = { getUsersById, registerUser, loginUser, getuserblog, blogsLikeByUser,getCurrentUser };