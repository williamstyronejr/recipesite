import path from 'path';
import crypto from 'crypto';
import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload/Upload.mjs';

const PATH_TO_IMG =
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '..', '..', 'public', 'images')
    : path.join(__dirname, '..', '..', '..', '..', 'src', 'public', 'images');

/**
 * Generates a pseudo random string using crypto.
 * @param {String} append String to append to file name (used for ext)
 * @returns {Promise<String>} Returns a promise to resolve with a random string.
 */
function generateRandomString(append = ''): Promise<string> {
  return new Promise((res, rej) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return rej(err);
      res(`${raw.toString('hex')}${append}`);
    });
  });
}

/**
 * Saves a file locally to the profile image folder and returns the new name of
 *  the file.
 * @param {Object} file File object recieved from graphql-upload.
 * @returns {Promise<String|null>} Returns a promise to resolve with file name
 *  of the uploaded file, or null if no file was uploaded.
 */
export async function uploadImage(
  file: FileUpload | null
): Promise<string | null> {
  if (!file) return null;

  const { filename, createReadStream } = await file;
  const stream = createReadStream();
  const newFileName = await generateRandomString(path.extname(filename));
  const out = createWriteStream(path.join(PATH_TO_IMG, newFileName));
  stream.pipe(out);
  await new Promise((res) => out.on('finish', res));

  return newFileName;
}
