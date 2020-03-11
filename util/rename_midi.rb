curdir = File.dirname(__FILE__) + "/../pd/midi/*"

Dir.glob(curdir).each do |f|
  File.rename(f, f.downcase.tr(" ", "_"))
  end



