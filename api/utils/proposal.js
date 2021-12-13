const motel = require("../models/motel");
const pos = require("../models/post");
const school = require("../models/school");
const removeVietnameseTones = require("./removeVietnameseTones");
const proposal = async (post) => {
  let pr = { ...post };
  const posts = await pos
    .find()
    .sort({ createdAt: "descending" })
    .populate("motel");
  const motels = await motel
    .find()
    .sort({ createdAt: "descending" })
    .populate("school");

  let postPr = [];
  let motelPr = [];
  for (let i = 0; i < posts.length; i++) {
    postPr.push({ ...posts[i]._doc, prioritize: 0 });
  }
  for (let i = 0; i < motels.length; i++) {
    motelPr.push({
      ...motels[i]._doc,
      prioritize: 0,
      thumbnail: motels[i].thumbnail.url,
    });
  }
  postPr = postPr.filter(
    (item) => JSON.stringify(item._id) !== JSON.stringify(post._id)
  );
  //   console.log(motelPr);
  //   console.log(postPr);
  //   console.log(post);
  const listSchool = await school.find({});
  if (pr.type == 1) {
    for (let i = 0; i < post.require.schools.length; i++) {
      const districtprovinceSchoolPost = listSchool.find(
        (item) =>
          JSON.stringify(post.require.schools[i]._id) ===
          JSON.stringify(item._id)
      );
      post.require.schools[i].district =
        districtprovinceSchoolPost.codeDistricts;
      post.require.schools[i].province =
        districtprovinceSchoolPost.codeProvince;
    }
    motelPr = motelPr.filter((item) =>
      item.school.some((s) =>
        post.require.schools.some((p) => s.codeDistricts === p.district)
      )
    );
    for (let i = 0; i < motelPr.length; i++) {
      if (
        post.require.schools.some((s) => {
          return motelPr[i].school.codeName === s.codeName;
        })
      )
        motelPr[i].prioritize += 6;
      if (
        post.require.schools.some((s) => {
          return motelPr[i].school.codeDistricts === s.district;
        })
      )
        motelPr[i].prioritize += 2;
      if (
        motelPr[i].room.some((item) => {
          return item.price == post.require.price;
        })
      )
        motelPr[i].prioritize += 3;
      const additional = post.require.additional.split(",");
      for (let j = 0; j < additional.length; j++) {
        const textToCheck = new RegExp(
          removeVietnameseTones(additional[j].trim()),
          "i"
        );
        if (textToCheck.test(removeVietnameseTones(motelPr[i].desc)))
          motelPr[i].prioritize += 1;
      }
    }
    for (let i = 0; i < postPr.length; i++) {
      if (postPr[i].type == 1) {
        if (
          !post.require.schools.some((s) =>
            postPr[i].require.schools.some(
              (p) =>
                s.province ===
                listSchool.find((item) => item.codeName === p.codeName)
                  .codeProvince
            )
          )
        ) {
          postPr[i].prioritize -= 100;
        }
        if (
          postPr[i].require.schools.some((item) =>
            post.require.schools.some((s) => s.codeName === item.codeName)
          )
        ) {
          if (post.status == true) postPr[i].prioritize += 7;
          else postPr[i].prioritize += 5;
        }
        if (
          post.require.price < postPr[i].require.price + 100000 &&
          post.require.price > postPr[i].require.price - 100000
        ) {
          postPr[i].prioritize += 2;
        }
        if (post.require.price === postPr[i].require.price) {
          postPr[i].prioritize += 5;
        }
        if (
          post.require.additional
            .split(",")
            .some((item) =>
              postPr[i].require.additional.split(",").some((a) => a === item)
            )
        )
          postPr[i].prioritize += 1;
      } else if (postPr[i].type == 2 || postPr[i].type == 3) {
        const motelToCheck = postPr[i].motel;
        let schoolMotel = [];
        listSchool.forEach((item) => {
          motelToCheck.school.forEach((s) => {
            if (JSON.stringify(s) === JSON.stringify(item._id))
              schoolMotel.push(item);
          });
        });
        if (
          post.require.schools.some((s) => {
            return motelToCheck.school.codeName === s.codeName;
          })
        )
          postPr[i].prioritize += 6;
        if (
          post.require.schools.some((s) => {
            return motelToCheck.school.codeDistricts === s.district;
          })
        )
          postPr[i].prioritize += 2;
        if (
          motelToCheck.room.some((item) => {
            return item.price == post.require.price;
          })
        )
          postPr[i].prioritize += 3;
        const additional = post.require.additional.split(",");
        for (let j = 0; j < additional.length; j++) {
          const textToCheck = new RegExp(
            removeVietnameseTones(additional[j].trim()),
            "i"
          );
          if (textToCheck.test(removeVietnameseTones(motelToCheck.desc)))
            motelToCheck.prioritize += 1;
        }
      }
    }
  } else if (post.type == 2) {
    for (let i = 0; i < post.motel.school.length; i++) {
      const districtprovinceSchoolPost = listSchool.find(
        (item) =>
          JSON.stringify(post.motel.school[i]) === JSON.stringify(item._id)
      );
      post.motel.school[i] = districtprovinceSchoolPost;
    }
    for (let i = 0; i < postPr.length; i++) {
      if (postPr[i].type == 1) {
        if (
          !postPr[i].require.schools.some((s) =>
            post.motel.school.some((m) => s.province === m.codeProvince)
          )
        )
          postPr[i].prioritize -= 99;
        if (
          postPr[i].require.schools.some((s) =>
            post.motel.school.some(
              (m) => JSON.stringify(s._id) === JSON.stringify(m._id)
            )
          ) &&
          postPr[i].status == false
        )
          postPr[i].prioritize += 9;

        for (
          let j = 0;
          j < postPr[i].require.additional.split(",").length;
          j++
        ) {
          for (let z = 0; z < post.require.additional.split(",").length; z++) {
            if (
              removeVietnameseTones(
                post.require.additional.split(",")[z].trim().toLowerCase()
              ) ===
              removeVietnameseTones(
                postPr[i].require.additional.split(",")[j].trim().toLowerCase()
              )
            )
              postPr[i].prioritize += 1;
          }
        }
      } else if (postPr[i].type == 2) {
        if (
          !postPr[i].motel.school.some((s) =>
            post.motel.school.some((m) => s.province === m.codeProvince)
          )
        )
          postPr[i].prioritize -= 99;
        if (
          postPr[i].motel.school.some((s) =>
            post.motel.school.some(
              (m) => JSON.stringify(s._id) === JSON.stringify(m._id)
            )
          ) &&
          postPr[i].status == false
        )
          postPr[i].prioritize += 9;
        const additional = post.require.additional.split(",");
        for (
          let j = 0;
          j < postPr[i].require.additional.split(",").length;
          j++
        ) {
          for (let z = 0; z < post.require.additional.split(",").length; z++) {
            if (
              removeVietnameseTones(
                post.require.additional.split(",")[z].trim().toLowerCase()
              ) ===
              removeVietnameseTones(
                postPr[i].require.additional.split(",")[j].trim().toLowerCase()
              )
            )
              postPr[i].prioritize += 1;
          }
        }
      } else if (postPr[i].type == 3) {
        if (
          JSON.stringify(post.motel._id) === JSON.stringify(postPr[i].motel._id)
        )
          postPr[i].prioritize += 17;
      }
    }
    for (let i = 0; i < motelPr.length; i++) {
      if (
        motelPr[i].school.some((s) =>
          post.motel.school.some(
            (p) => JSON.stringify(s._id) === JSON.stringify(p._id)
          )
        )
      )
        motelPr[i].prioritize += 9;
      if (
        motelPr[i].school.some((s) =>
          post.motel.school.some(
            (p) =>
              JSON.stringify(s.codeProvince) === JSON.stringify(p.codeProvince)
          )
        )
      )
        motelPr[i].prioritize += 3;
      if (
        motelPr[i].school.some((s) =>
          post.motel.school.some(
            (p) =>
              JSON.stringify(s.codeDistricts) ===
              JSON.stringify(p.codeDistricts)
          )
        )
      )
        motelPr[i].prioritize += 6;
    }
  } else if (post.type == 3) {
    for (let i = 0; i < post.motel.school.length; i++) {
      const districtprovinceSchoolPost = listSchool.find(
        (item) =>
          JSON.stringify(post.motel.school[i]) === JSON.stringify(item._id)
      );
      post.motel.school[i] = districtprovinceSchoolPost;
    }
    for (let i = 0; i < postPr.length; i++) {
      if (postPr[i].type == 1) {
        if (
          !postPr[i].require.schools.some((s) =>
            post.motel.school.some((m) => s.province === m.codeProvince)
          )
        )
          postPr[i].prioritize -= 99;
        if (
          postPr[i].require.schools.some((s) =>
            post.motel.school.some(
              (m) => JSON.stringify(s._id) === JSON.stringify(m._id)
            )
          ) &&
          postPr[i].status == false
        )
          postPr[i].prioritize += 6;
      } else if (postPr[i].type == 2) {
        if (
          !postPr[i].motel.school.some((s) =>
            post.motel.school.some((m) => s.province === m.codeProvince)
          )
        )
          postPr[i].prioritize -= 99;
        if (
          postPr[i].motel.school.some((s) =>
            post.motel.school.some(
              (m) => JSON.stringify(s._id) === JSON.stringify(m._id)
            )
          ) &&
          postPr[i].status == false
        )
          postPr[i].prioritize += 7;
      } else if (postPr[i].type == 3) {
        if (
          JSON.stringify(post.motel._id) === JSON.stringify(postPr[i].motel._id)
        )
          postPr[i].prioritize += 20;
        if (JSON.stringify(post.owner._id) === JSON.stringify(postPr[i].owner))
          postPr[i].prioritize += 10;
      }
    }
    for (let i = 0; i < motelPr.length; i++) {
      if (
        motelPr[i].school.some((s) =>
          post.motel.school.some(
            (p) => JSON.stringify(s._id) === JSON.stringify(p._id)
          )
        )
      )
        motelPr[i].prioritize += 9;
      if (
        motelPr[i].school.some((s) =>
          post.motel.school.some(
            (p) =>
              JSON.stringify(s.codeProvince) === JSON.stringify(p.codeProvince)
          )
        )
      )
        motelPr[i].prioritize += 3;
      if (
        motelPr[i].school.some((s) =>
          post.motel.school.some(
            (p) =>
              JSON.stringify(s.codeDistricts) ===
              JSON.stringify(p.codeDistricts)
          )
        )
      )
        motelPr[i].prioritize += 6;
    }
  }
  pr.posts = postPr.sort((p1, p2) => p2.prioritize - p1.prioritize).slice(0, 6);
  pr.motels = motelPr
    .sort((p1, p2) => p2.prioritize - p1.prioritize)
    .slice(0, 4);
  return pr;
};

module.exports = proposal;
