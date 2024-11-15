const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const Sharp = require('sharp');

const s3Client = new S3Client({ region: 'ap-northeast-2' });
const TARGET_BUCKET = 'target-bucket-image-resize-1114';

exports.resize = async (event) => {
  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = event.Records[0].s3.object.key;
  const dstKey = `resized-${srcKey}`;

  try {
    // S3에서 원본 이미지 가져오기
    const getObjectResponse = await s3Client.send(
      new GetObjectCommand({
        Bucket: srcBucket,
        Key: srcKey
      })
    );

    // Stream을 Buffer로 변환
    const imageBuffer = await streamToBuffer(getObjectResponse.Body);

    // Sharp로 이미지 리사이징
    const resizedImage = await Sharp(imageBuffer)
      .resize(200, 200)
      .toBuffer();

    // 리사이징된 이미지 S3에 업로드
    await s3Client.send(
      new PutObjectCommand({
        Bucket: TARGET_BUCKET,
        Key: dstKey,
        Body: resizedImage,
        ContentType: 'image/jpeg'
      })
    );

    console.log(`Successfully resized and uploaded image: ${dstKey}`);
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
};

// Stream을 Buffer로 변환하는 유틸리티 함수
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
