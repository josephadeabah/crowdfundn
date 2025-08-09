class SignatureImageGenerator
  def self.generate(signature_points, width: 400, height: 150, color: '000000')
    require 'chunky_png'

    png = ChunkyPNG::Image.new(width, height, ChunkyPNG::Color::TRANSPARENT)
    rgb = color.match(/^#?(..)(..)(..)$/).captures.map(&:hex)

    signature_points.each_cons(2) do |point1, point2|
      x1 = (point1['x'] * width).to_i
      y1 = (point1['y'] * height).to_i
      x2 = (point2['x'] * width).to_i
      y2 = (point2['y'] * height).to_i
      
      png.line(x1, y1, x2, y2, ChunkyPNG::Color.rgb(*rgb))
    end

    png.to_blob
  end

  def self.generate_issuer_signature
    # This would generate your organization's official signature
    # Could be loaded from a file or generated dynamically
    issuer_name = "Bantuhive Ltd"
    width = 300
    height = 100
    
    require 'chunky_png'
    png = ChunkyPNG::Image.new(width, height, ChunkyPNG::Color::TRANSPARENT)
    
    # Draw a simple signature line with text
    png.line(10, 80, width-10, 80, ChunkyPNG::Color.rgb(0, 0, 0))
    png.compose!(ChunkyPNG::Image.from_text(issuer_name, width: width))
    
    png.to_blob
  end
end