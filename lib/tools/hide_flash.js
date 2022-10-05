(function () {
  var currentSettings = JSON.parse(localStorage.getItem("hnspecial-settings"));
  if (
    currentSettings === null || // Prevent flash after fresh install too
    currentSettings.visual_theme ||
    currentSettings.high_contrast ||
    currentSettings.gray_visited_links ||
    currentSettings.sticky_header
  ) {
    // Apply custom styles to set a dark background when preloading the dark theme. Avoids a white flash.
    if (currentSettings !== null && currentSettings.dark_theme) {
      document.documentElement.style.backgroundColor = "#222222";
    }
    document.documentElement.style.display = "none";
  }
}.call(this));
