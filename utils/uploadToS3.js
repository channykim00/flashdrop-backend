import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadFileToS3 = async ({ fileId, chunkIndex, buffer }) => {
  const Key = `chunks/${fileId}/chunk-${chunkIndex}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key,
    Body: buffer,
  };

  return s3.upload(params).promise();
};
