const mockGroupList = [
  {
      "id": 1,
      "name": "View",
      "permissions": [
          "READ"
      ]
  },
  {
      "id": 2,
      "name": "Admin",
      "permissions": [
          "READ",
          "WRITE",
          "DELETE",
          "SHARE",
          "UPLOAD_FILES"
      ]
  },
  {
      "id": 3,
      "name": "Editors",
      "permissions": [
          "READ",
          "WRITE",
          "UPLOAD_FILES"
      ]
  },
  {
      "id": 4,
      "name": "User",
      "permissions": [
          "READ",
          "SHARE"
      ]
  },
  {
      "id": 19,
      "name": "test2",
      "permissions": [
          "READ"
      ]
  }
];
module.exports = { mockGroupList };
