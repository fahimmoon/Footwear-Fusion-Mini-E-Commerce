// Simple users controller with basic handlers

// Example in-memory sample data (replace with DB calls as needed)
const sampleUsers = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

exports.getAll = (req, res) => {
  // return a list of users
  res.json(sampleUsers);
};

exports.getById = (req, res) => {
  const { id } = req.params;
  const user = sampleUsers.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};

module.exports = {};
