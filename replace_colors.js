const fs = require('fs');
const path = require('path');

const colorMap = {
  // Oranges to #F99912
  '#FF8D28': '#F99912',
  '#ff8d28': '#f99912',
  '#FFB84D': '#F99912',
  '#ffb84d': '#f99912',
  '#FFB800': '#F99912',
  '#ffb800': '#f99912',
  '#F57C00': '#F99912',
  '#f57c00': '#f99912',

  // Greens to #9ACD32
  '#4CAF50': '#9ACD32',
  '#4caf50': '#9acd32',
  '#2E7D32': '#9ACD32',
  '#2e7d32': '#9acd32',
  '#7BA820': '#9ACD32', 
  '#7ba820': '#9acd32',

  // Blues/Purples to #9370DB
  '#2196F3': '#9370DB',
  '#2196f3': '#9370db',
  '#1976D2': '#9370DB',
  '#1976d2': '#9370db',
  '#9C27B0': '#9370DB',
  '#9c27b0': '#9370db',
  '#B4A7D6': '#9370DB', 
  '#b4a7d6': '#9370db',
  '#6A5AA6': '#9370DB',
  '#6a5aa6': '#9370db',
};

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  
  files.forEach(function(file) {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.tsx', '.ts', '.css', '.js', '.jsx'].includes(ext)) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });
  
  return arrayOfFiles;
}

const files = getAllFiles(path.join(__dirname, 'src'));
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // First replace common bad gradients manually for better effect:
  // Orange gradients
  newContent = newContent.replace(/#FF8D28 0%, ?#FFB84D 100%/gi, '#F99912 0%, #9ACD32 100%');
  newContent = newContent.replace(/#FF8D28 0%, ?#FFB84D 50%, ?#FF8D28 100%/gi, '#F99912 0%, #9ACD32 50%, #9370DB 100%');
  newContent = newContent.replace(/to bottom, ?#FF8D28, ?#FFB84D/gi, 'to bottom, #F99912, #9ACD32');
  newContent = newContent.replace(/to bottom, ?#FF8D28, ?#FFB84D, ?#4CAF50/gi, 'to bottom, #F99912, #9ACD32, #9370DB');
  
  // Purple/Blue gradients
  newContent = newContent.replace(/#2196F3 0%, ?#1976D2 100%/gi, '#9370DB 0%, #F99912 100%');
  newContent = newContent.replace(/#9370DB 0%, ?#B4A7D6 100%/gi, '#9370DB 0%, #F99912 100%');
  newContent = newContent.replace(/#9370DB 0%, ?#9ACD32 50%, ?#6A5AA6 100%/gi, '#9370DB 0%, #9ACD32 50%, #F99912 100%');
  
  // Green gradients
  newContent = newContent.replace(/#4CAF50 0%, ?#2E7D32 100%/gi, '#9ACD32 0%, #9370DB 100%');
  newContent = newContent.replace(/#9ACD32 0%, ?#7BA820 100%/gi, '#9ACD32 0%, #9370DB 100%');
  
  // Specific mixed
  newContent = newContent.replace(/#FF8D28 0%, ?#FFB84D 50%, ?#4CAF50 100%/gi, '#F99912 0%, #9ACD32 50%, #9370DB 100%');
  newContent = newContent.replace(/#F99912 0%, ?#E8860A 100%/gi, '#F99912 0%, #9ACD32 100%');

  // Multi-gradient class updates
  newContent = newContent.replace(/#ff8d28, #4caf50, #2196f3, #ff8d28/g, '#f99912, #9acd32, #9370db, #f99912');
  newContent = newContent.replace(/#ff8d28, #ffb84d, #4caf50, #2196f3/g, '#f99912, #9acd32, #9370db, #f99912');
  
  // CSS escapes for specific tailwind classes
  newContent = newContent.replace(/hover:text-\[#FFB84D\]/g, 'hover:text-[#F99912]');
  
  // CSS specific background values
  newContent = newContent.replace(/#FFB84D20/g, '#F9991220');
  newContent = newContent.replace(/#4CAF5020/g, '#9ACD3220');
  newContent = newContent.replace(/#2196F320/g, '#9370DB20');

  // Now replace all remaining individual colors
  for (const [oldColor, newColor] of Object.entries(colorMap)) {
    const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    newContent = newContent.replace(regex, newColor);
  }

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    changedCount++;
  }
});

console.log('Modified files:', changedCount);
