const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

require('dotenv').config({ path: 'variables.env' });

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

const bucket = bucketName;

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

  return s3.upload(uploadParams).promise();

}
// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream();

}

const downloadFile = async (fileKey, location) => {

  const params = {
    Key: fileKey,
    Bucket: bucketName
  }

  try {
    const { Body } = await s3.getObject(params).promise();
    await fs.writeFile(location + fileKey, Body, function (err, result) {
      if (err) console.log('error', err);
    });
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(250);
    return { success: true }
  } catch (error) {
    return { success: false, data: null }
  }

}

function deleteFile(fileKey) {
  try {
    const params = {
      Key: fileKey,
      Bucket: bucketName
    }

    s3.deleteObject(params).promise();
  } catch (err) {
    console.error(err);
  }

}

module.exports = {
  s3,
  bucket,
  uploadFile,
  getFileStream,
  downloadFile,
  deleteFile
};