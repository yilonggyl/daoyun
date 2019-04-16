export default {
  '/api/auth_routes': {
    '/': { authority: ['admin', 'user'] },
    '/system': { authority: ['admin'] },
    '/standard': { authority: ['admin'] },
  },
};
