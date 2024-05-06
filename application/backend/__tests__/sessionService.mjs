const sessions = { 'validUser': { username: 'validUser', sessionData: {} } };

export const getSession = async (username) => {
  return sessions[username] || null;
};