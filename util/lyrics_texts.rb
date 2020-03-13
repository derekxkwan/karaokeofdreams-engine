require 'midilib'

def get_timing(curfile)
  seq = MIDI::Sequence.new()
  cur_max = 0
  
  File.open(curfile, 'rb') do |file|
    seq.read(file) do |track, num_tracks, i|
      #puts "read track #{track ? track.name : ''} (#{i} of #{num_tracks})"
    end
  end

  curmeas = seq.get_measures
  bpm = seq.bpm
  num_beats = curmeas.inject(0) do |acc, x|
    num = x.numerator
    denom = 2 ** x.denominator
    acc = acc + (num * num/denom)
  end

  return 60 * (num_beats.to_f/bpm)
end

curdir = File.dirname(__FILE__)
lyricdir = curdir + "/../res"
mididir = curdir + "/../pd/midi"

lyricfiles = Dir.each_child(lyricdir).to_a
basefiles = lyricfiles.map{|x| File.basename(x, ".txt")}
print basefiles
puts ""
basestr = basefiles.map{|x| x.downcase.gsub(/[\s\,]/, '_') + ";"}.join("\n")
midifiles = basefiles.map{|x| x.downcase.gsub(/[\s\,]/, '_')}

mididurs = midifiles.map do |x|
  curfile = mididir + "/" + x + ".mid"
  get_timing(curfile)
end

basestr = midifiles.each_with_index.map{|x, i|"%s %f;" % [x, mididurs[i]]}.join("\n")
  
# basestr = basefiles.join("\n")
File.open(curdir + "/../pd/midifiles.txt", "w") do |cur|  
  cur.write(basestr)
end
