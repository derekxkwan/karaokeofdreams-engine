curdir = File.dirname(__FILE__)
lyricfiles = Dir.each_child(curdir + "/../res").to_a
basefiles = lyricfiles.map{|x| File.basename(x, ".txt")}
print basefiles
puts ""
basestr = basefiles.map{|x| x.downcase.tr(" ", "_")}.join("\n")
# basestr = basefiles.join("\n")
File.open(curdir + "/../pd/midifiles.txt", "w") do |cur|  
  cur.write(basestr)
end
