const fs = require('fs');
const path = require('path');

// Get the --name argument
const args = process.argv.slice(2);
const nameArg = args.find(arg => arg.startsWith('--name='));

if (!nameArg) {
  console.error('❌ Please provide a service name with --name');
  process.exit(1);
}

const rawName = nameArg.split('=')[1];

// Convert to kebab-case for file name (e.g. "user-profile" -> "user-profile.service.ts")
const fileName = `${rawName.toLowerCase()}.service.ts`;

// Convert to PascalCase for class name (e.g. "user-profile" -> "UserProfileService")
const className = rawName
  .split(/[-_ ]/)
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('') + 'Service';

// Final path
const servicesDir = path.join(__dirname, '../src', 'services');
const filePath = path.join(servicesDir, fileName);

// Boilerplate content
const boilerplate = `
// ${fileName}

export class ${className} {
  static #instance: ${className} 
  private constructor() {}
  
  static getInstance(): ${className} {
    if(!this.#instance) {
        this.#instance = new ${className}();
    }
    return this.#instance;
  }
}
`.trimStart();

// Ensure /services directory exists
if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir);
}

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.error(`❌ File '${filePath}' already exists.`);
  process.exit(1);
}

// Write the file
fs.writeFileSync(filePath, boilerplate, 'utf8');
console.log(`✅ Service created: services/${fileName}`);


// USAGE: 
// node scripts/generate-singleton-service.ts --name=somename
// FROM PACKAGE.JSON
// npm run service:generate -- --name=somename