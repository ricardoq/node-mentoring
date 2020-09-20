module.exports = class UserService {
  constructor(userModel) {
      this.userModel = new userModel();
  }

  async isLogged(username, password) {
    const user = await this.userModel.getLoggedUser(username, password);
    return user[0];
  }

  async getAutoSuggestUsers(loginSubstring = '', limit) {
    const users = await this.userModel.getUsers(loginSubstring, limit);
    return this.removeDeleted(users);
  }

  async findUser(id) {
    const response = await this.userModel.getUser(id);
    return response;
  }

  async deleteUser(id) {
    const response = await this.userModel.deleteUser(id);
    return response[0] ? response[0].isdeleted : '';
  }

  async addUser(newUser) {
    const response = await this.userModel.postNewUser(newUser);
    return response;
  }

  async updateUser(changesUser) {
    const originalUser = await this.findUser(changesUser.id);
    const newValues = {
      ...originalUser[0],
      ...changesUser,
    };
    const response = await this.userModel.updateUser(newValues);
    return response;
  }

  removeDeleted(userList) {
    return userList.filter(u => !u.isdeleted);
  }
}
