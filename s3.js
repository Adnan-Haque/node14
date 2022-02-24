const AWS = require('aws-sdk');
const multer = require('multer');
const multers3 = require('multer-s3');
require('dotenv').config();

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId =  process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY


const s3 = new AWS.S3({
  region: region,
  secretAccessKey: secretAccessKey,
  accessKeyId: accessKeyId
});

// uploads file to s3

var upload = multer({
    storage: multers3({
      s3: s3,
      bucket: bucketName,
      contentType: multers3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        // console.log(req.body);
        cb(null, 'image/'+Date.now().toString())
      }
    })
  })

  exports.upload = upload