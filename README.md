Quick start template based on simple BoilerPlate + Bootstrap + Sass + Gulp + Babel
=============
Easy HTML Sceleton based on simple BoilerPlate, Bootstrap and Sass with Gulp.


Gulp has 5 main tasks:

  - `yarn dev`/`npm run dev` (Main development task with files watching and a server with livereload)
  - `yarn build`/`npm run build` (Building project task. CSS+JS+Images processing)
  - `gulp deploy` (For deployment via SSH, you need to set host, login/pass and path in gulpfile.js)
  - `gulp publish` (For publishing app folder, exclude `src`, to your GitHub Pages. Need to have repository. [Read more here - gh-pages](https://github.com/tschaub/gh-pages))
  
  Including:
  - LiveReload
  - Compressing images (optipng, pngquant)
  - Compressing JS (uglify)
  - Compressing CSS (csso)
  - Vendor prefixes in CSS (autoprefix)
  - Babel
  - [gh-pages](https://github.com/tschaub/gh-pages)
