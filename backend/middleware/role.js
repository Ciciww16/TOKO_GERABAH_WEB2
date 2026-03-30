// backend/middleware/role.js
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Akses ditolak. Hanya untuk admin.' });
    }
    next();
};

export const isAdminOrCashier = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'cashier') {
        return res.status(403).json({ msg: 'Akses ditolak. Hanya untuk admin dan cashier.' });
    }
    next();
};

export const isCustomer = (req, res, next) => {
    if (req.user.role !== 'customer') {
        return res.status(403).json({ msg: 'Akses ditolak. Hanya untuk customer.' });
    }
    next();
};