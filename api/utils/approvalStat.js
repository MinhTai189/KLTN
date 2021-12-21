const approval = require("../models/approval");
const approve = {
  addPostApproval: (_id, content, owner, user) => {
    const addApproval = new approval({
      owner: owner,
      content: content,
      url: `/posts/${_id}`,
      type: "post",
      user,
    });
    addApproval.save();
  },
  addMotelApproval: (_id, content, owner, user) => {
    const addApproval = new approval({
      owner: owner,
      content: content,
      url: `/motels/${_id}`,
      type: "motel",
      user,
    });
    addApproval.save();
  },
  addUpdateMotelApproval: (_id, content, owner, user) => {
    const addApproval = new approval({
      owner: owner,
      content: content,
      url: `/motels/${_id}`,
      type: "update-motel",
      user,
    });
    addApproval.save();
  },
  addRateApproval: (_id, content, owner, user) => {
    const addApproval = new approval({
      owner: owner,
      content: content,
      url: `/motels/${_id}`,
      type: "rate",
      user,
    });
    addApproval.save();
  },
};
module.exports = approve;
