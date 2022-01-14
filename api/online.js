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
    this.users.push({ ...user });
  };
  pullUserOffline = (id) => {
    this.users = this.users.filter(
      (item) => JSON.stringify(item._id) !== JSON.stringify(id)
    );
  };
  getUsers = (page, limit) => {
    return {
      list:
        limit > -1
          ? this.fixList().slice((page - 1) * limit, page * limit)
          : this.fixList(),
      total: this.users.length,
      totalRoleUser: this.users.filter((item) => item.isAdmin === false).length,
      totalRoleAdmin: this.users.filter((item) => item.isAdmin === true).length,
    };
  };
  fixList = () => {
    let arr = [];
    this.users.forEach((user) => {
      if (
        !arr.some((userSome) => {
          return JSON.stringify(userSome._id) === JSON.stringify(user._id);
        })
      )
        arr = [...arr, { ...user }];
    });
    return arr;
  };
}

module.exports = new Online();
