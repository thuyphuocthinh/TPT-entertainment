import https from "https";
import fs from "fs";

export const downloadMp3 = (url: string, name: string) => {
  const file = fs.createWriteStream(name);

  https
    .get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Failed to get '${url}' (${response.statusCode})`);
        response.resume();
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close(() => {
          console.log(`MP3 file downloaded as ${name}`);
        });
      });
    })
    .on("error", (err) => {
      fs.unlink(name, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error deleting file: ${unlinkErr.message}`);
        }
        console.error(`Error downloading MP3 file: ${err.message}`);
      });
    });

  file.on("error", (err) => {
    fs.unlink(name, (unlinkErr) => {
      if (unlinkErr) {
        console.error(`Error deleting file: ${unlinkErr.message}`);
      }
      console.error(`File stream error: ${err.message}`);
    });
  });
};

