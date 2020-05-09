Quick start template based on simple BoilerPlate + Bootstrap + Sass + Gulp + Babel
=============
Easy HTML Sceleton based on simple BoilerPlate, Bootstrap and Sass with Gulp.


Gulp has 5 main tasks:

  - `gulp` (Default task for development - compile js and less)
  - `yarn dev` (Task for creating a server with livereload)
  - `gulp full` (Task for full build, include image compression and etc.)
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
