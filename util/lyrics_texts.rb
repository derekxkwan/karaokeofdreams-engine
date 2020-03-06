print Dir.each_child(File.dirname(__FILE__) + "/../res").to_a.map{|x| File.basename(x, ".txt")}
puts ""
