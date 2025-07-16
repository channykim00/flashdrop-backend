import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const getTotalChunksFromS3 = async (fileId) => {
  const listParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: `chunks/${fileId}/`,
  };

  try {
    const listedObjects = await s3.listObjectsV2(listParams).promise();
    return listedObjects.Contents.length;
  } catch (err) {
    console.error("S3에서 청크 조회 실패:", err);
    return 0;
  }
};

export default getTotalChunksFromS3;
