import LinkModel from "../models/Link.js";

const getLinkByUniqueUrl = async (uniqueUrl) => {
  if (!uniqueUrl) {
    throw new Error("uniqueUrl 누락");
  }

  const link = await LinkModel.findOne({ uniqueUrl });

  if (!link) {
    const err = new Error("유효하지 않은 링크");
    err.statusCode = 400;
    throw err;
  }

  return link;
};

export default getLinkByUniqueUrl;
