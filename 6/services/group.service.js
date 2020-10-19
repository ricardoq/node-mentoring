module.exports = class GroupService {
  constructor(groupModel) {
      this.groupModel = new groupModel();
  }

  async findGroup(groupId) {
    const group = await this.groupModel.getGroupById(groupId);
    return group[0];
  }

  async getGroups(limit) {
    const groups = await this.groupModel.getGroups(limit);
    return groups;
  }

  async addGroup(newGroup) {
    const groups = await this.groupModel.postGroup(newGroup);
    return groups;
  }

  async updateGroup(changesGroup) {
    const originalGroup = await this.groupModel.getGroupById(changesGroup.id);
    const newValues = {
      ...originalGroup[0],
      ...changesGroup,
    };
    const response = await this.groupModel.updateGroup(newValues);
    return response;
  }

  async deleteGroup(id) {
    const response = await this.groupModel.deleteGroup(id);
    return response;
  }
}
