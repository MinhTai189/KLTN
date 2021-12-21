class Online {
  constructor() {
    this.users = [];
  }
  getUserById = (id) => {
    return this.users.find(
      (item) => JSON.stringify(id) === JSON.stringify(item._id)
    );
  };
  addUserOnline = (user) => {
    this.users = [...this.users, { ...user }];
  };
  pullUserOffline = (id) => {
    this.users = this.users.filter(
      (item) => JSON.stringify(item._id) !== JSON.stringify(id)
    );
  };
  getUsers = (page, limit) => {
    return {
      list: this.users.slice((page - 1) * limit, page * limit),
      total: this.users.length,
      totalRoleUser: this.users.filter((item) => item.isAdmin === false).length,
      totalRoleAdmin: this.users.filter((item) => item.isAdmin === true).length,
    };
  };
}

module.exports = new Online();
