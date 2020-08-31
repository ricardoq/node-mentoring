module.exports = class User {
  constructor(
      userModel,
      utils = {getAutoSuggestUsers: ()=>{}, errorResponse: ()=>{}}
    ) {
      this.utils = utils;
      this.userModel = new userModel();
  }
}
