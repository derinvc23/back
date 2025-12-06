const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes('admin')) {
        return res.status(403).json({ error: 'Access denied. Administrator role required.' });
    }
    next();
};

module.exports = isAdmin;
