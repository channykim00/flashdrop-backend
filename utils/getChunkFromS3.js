import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const getChunkFromS3 = async (fileId, chunkIndex) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `chunks/${fileId}/chunk-${chunkIndex}`,
  };

  const data = await s3.getObject(params).promise();
  return data.Body;
};
