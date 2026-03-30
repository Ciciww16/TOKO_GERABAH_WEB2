// backend/middleware/logger.js
export const logger = (req, res, next) => {
    const start = Date.now();

    // Log setelah response selesai
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        };

        // Warna untuk status code
        let statusColor = '\x1b[32m'; // Hijau untuk sukses
        if (res.statusCode >= 400) statusColor = '\x1b[31m'; // Merah untuk error
        if (res.statusCode >= 500) statusColor = '\x1b[33m'; // Kuning untuk server error

        console.log(
            `${log.timestamp} | ${log.method.padEnd(6)} | ${statusColor}${log.status}\x1b[0m | ${log.duration.padEnd(8)} | ${log.url}`
        );
    });

    next();
};