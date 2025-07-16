import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const deleteChunksFromS3 = async (fileId) => {
  const listParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: `chunks/${fileId}/`,
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (!listedObjects.Contents.length) return;

  const deleteParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Delete: {
      Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
    },
  };

  await s3.deleteObjects(deleteParams).promise();
};
