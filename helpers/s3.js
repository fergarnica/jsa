const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

require('dotenv').config({ path: 'variables.env' });

const bucketName = process.env.AWS_BUCKET_NAME || "jsa-system";
const region = process.env.AWS_BUCKET_REGION || "us-east-1";
const accessKeyId = process.env.AWS_ACCESS_KEY || "AKIASWQMBGEUGOOX3NSY";
const secretAccessKey = process.env.AWS_SECRET_KEY || "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";

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

// uploads a file to s3
function uploadFile(file, uuid) {

  const fileStream = fs.createReadStream(file.tempFilePath);

  const extension = file.mimetype.split('/')[1];
  const nameFile = `${uuid}.${extension}`

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: nameFile
  }

  return s3.upload(uploadParams).promise()
}

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream();
}

const downloadFromS3 = async (fileKey, location) => {

  const params = {
    Key: fileKey,
    Bucket: bucketName
  }

  const { Body } = await s3.getObject(params).promise();

  await fs.writeFile(location + fileKey, Body, function (err, result) {
    if (err) console.log('error', err);
  });

  return true;

}

module.exports = {
  uploadFile,
  getFileStream,
  downloadFromS3
};