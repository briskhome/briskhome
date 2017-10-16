export default req => (req && req.cookies ? req.cookies['jwt'] : null);
