const fs = require("fs-extra");

const listFolderCopy = [
  {
    sourceDirectory: "views",
    targetDirectory: "dist/views",
  },
  {
    sourceDirectory: "public",
    targetDirectory: "dist/public",
  },
];

listFolderCopy.forEach((item) => {
  fs.copy(item.sourceDirectory, item.targetDirectory, (err) => {
    if (err) {
      console.log(`Error copy folder ${item.sourceDirectory}: `, err);
    } else {
      console.log(`Copied successfully folder ${item.sourceDirectory}`);
    }
  });
});
