/**
Full width module
Author: Derrick Cohodas (https://github.com/dav-)
 */

HNSpecial.settings.registerModule("full_width", function () {
  document.documentElement.classList.add("hnspecial-theme-full-width");
  
  if(!HNSpecial.settings.moduleEnabled('visual_theme')){
    document.documentElement.classList.add("hnspecial-theme-full-width-no-visual");
  }
});