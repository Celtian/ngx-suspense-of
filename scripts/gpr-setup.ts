import { writeFileSync } from 'fs-extra';
import { join } from 'path';
import distPackage from '../dist/ngx-suspense-of/package.json';

// Modify package.json in dist folder
const pkg: Record<string, any> = distPackage;

pkg.publishConfig = {};
pkg.name = '@celtian/ngx-suspense-of';
pkg.publishConfig.registry = 'https://npm.pkg.github.com';

writeFileSync(join(__dirname, '..', 'dist', 'ngx-suspense-of', 'package.json'), JSON.stringify(pkg, null, 2));
console.log('File package.json modified:', pkg);
