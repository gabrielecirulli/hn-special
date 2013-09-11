require 'json'

task :default => :build

task :build do |t|
  manifest = JSON.parse File.read "manifest.json"
  version = manifest["version"]
  directory = File.basename Dir.getwd
  excludes = ["Rakefile", "README.md", "asset-src/", "asset-src/*", "promo/*.png"].map { |f| "#{directory}/#{f}" }.join " "
  command = "cd .. && zip -r hn-special-v#{version}.zip #{directory}/* -x #{excludes}"

  puts "Zipping version #{version}..."
  puts "Running `#{command}`"
  system command
end
