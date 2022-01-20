const user = require("../models/user");
const change = (userId, credit, io) => {
  user
    .findByIdAndUpdate(userId, { $inc: { credit: credit } })
    .select("credit")
    .then((res) => {
      changeRankAfter(res, credit, io);
    });
};
const changeRankAfter = (userChange, plusCredit, io) => {
  if (userChange) {
    let cre = userChange.credit + plusCredit;
    let rank = "Người qua đường";
    if (cre > 0 && cre <= 20) rank = "Người qua đường";
    else if (cre > 20 && cre <= 150) rank = "Người tốt tính";
    else if (cre > 150 && cre <= 300) rank = "Tấm lòng son";
    else if (cre > 300 && cre <= 500) rank = "Sống vì người khác";
    else if (cre > 500 && cre <= 700) rank = "Trái tim nhân ái";
    else if (cre > 700 && cre <= 1000) rank = "Thánh hiền";
    else if (cre > 1000) rank = "Siêu anh hùng";
    else if (cre < 0) rank = "Dân phá hoại";

    if (userChange.rank != rank)
      if (plusCredit > 0)
        io.notifyToUser(userChange._id, {
          message: `Chúc mừng bạn đã đạt danh hiệu mới: ${rank}, hãy tiếp tục phát huy nhé ❤😘`,
          url: `/profile/${userChange._id}`,
          imageUrl:
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1642493265/notify/confetti_aja4hy.png",
        });
      else
        io.notifyToUser(userChange._id, {
          message: `Bạn đã bị rớt xuống danh hiệu: ${rank}, hãy cố gắng vươn lên nhé`,
          url: `/profile/${userChange._id}`,
          imageUrl:
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1642494249/notify/ranking_aghr5s.png",
        });
    userChange.rank = rank;
    userChange.save();
  }
};
const changeRank = (userChange, newCredit, io) => {
  if (userChange) {
    let cre = newCredit;
    let rank = "Người qua đường";
    if (cre > 0 && cre <= 20) rank = "Người qua đường";
    else if (cre > 20 && cre <= 150) rank = "Người tốt tính";
    else if (cre > 150 && cre <= 300) rank = "Tấm lòng son";
    else if (cre > 300 && cre <= 500) rank = "Sống vì người khác";
    else if (cre > 500 && cre <= 700) rank = "Trái tim nhân ái";
    else if (cre > 700 && cre <= 1000) rank = "Thánh hiền";
    else if (cre > 1000) rank = "Siêu anh hùng";
    else if (cre < 0) rank = "Dân phá hoại";

    if (userChange.rank != rank)
      if (userChange.credit - newCredit < 0)
        io.notifyToUser(userChange._id, {
          message: `Chúc mừng bạn đã đạt danh hiệu mới: ${rank}, hãy tiếp tục phát huy nhé ❤😘`,
          url: `/profile/${userChange._id}`,
          imageUrl:
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1642493265/notify/confetti_aja4hy.png",
        });
      else
        io.notifyToUser(userChange._id, {
          message: `Bạn đã bị rớt xuống danh hiệu: ${rank}, hãy cố gắng vươn lên nhé`,
          url: `/profile/${userChange._id}`,
          imageUrl:
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1642494249/notify/ranking_aghr5s.png",
        });
    userChange.rank = rank;
    userChange.save();
  }
};

module.exports = { change, changeRank };
