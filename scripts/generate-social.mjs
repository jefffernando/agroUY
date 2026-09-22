import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
for(const file of await readdir('public/images')){
 if(file.endsWith('.svg')) await sharp('public/images/'+file).resize(1200,630,{fit:'cover'}).png().toFile('public/images/'+file.replace('.svg','.png'));
}
console.log('Portadas sociales PNG generadas.');
