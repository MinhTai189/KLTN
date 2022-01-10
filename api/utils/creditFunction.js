const user = require("../models/user");
const change = (userId, credit) => {
  user
    .findByIdAndUpdate(userId, { $inc: { credit: credit } }, { new: true })
    .select("credit")
    .then((res) => {
      changeRank(res);
    });
};
const changeRank = (newUser) => {
  if (newUser) {
    let cre = newUser.credit;
    let rank = "Người qua đường";
    if (cre > 0 && cre <= 20) rank = "Người qua đường";
    else if (cre > 20 && cre <= 150) rank = "Người tốt tính";
    else if (cre > 150 && cre <= 300) rank = "Tấm lòng son";
    else if (cre > 300 && cre <= 500) rank = "Sống vì người khác";
    else if (cre > 500 && cre <= 700) rank = "Trái tim nhân ái";
    else if (cre > 700 && cre <= 1000) rank = "Thánh hiền";
    else if (cre > 1000) rank = "Siêu anh hùng ";
    newUser.rank = rank;
    newUser.save();
  }
};

module.exports = { change, changeRank };
