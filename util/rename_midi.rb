curdir = File.dirname(__FILE__) + "/../pd/midi/*"

Dir.glob(curdir).each do |f|
  File.rename(f, f.downcase.gsub(/[\s\,]/, "_"))
end



