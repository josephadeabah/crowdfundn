# app/services/signature_image_generator.rb
class SignatureImageGenerator
  def self.generate(signature_data, width: 400, height: 200)
    require 'rmagick'
    
    # Create a new image with white background
    image = Magick::Image.new(width, height) { |img| img.background_color = 'white' }
    draw = Magick::Draw.new
    
    # Set drawing properties
    draw.stroke('black')
    draw.stroke_width(2)
    draw.fill('transparent')
    draw.stroke_linejoin('round')
    draw.stroke_linecap('round')
    
    # Draw the signature if we have data
    if signature_data.is_a?(Array) && signature_data.any?
      # Convert to array of points
      points = signature_data.map { |point| [point['x'].to_f, point['y'].to_f] }
      
      # Find min/max to normalize coordinates
      min_x = points.map(&:first).min
      max_x = points.map(&:first).max
      min_y = points.map(&:last).min
      max_y = points.map(&:last).max
      
      # Scale points to fit canvas if needed
      if max_x - min_x > 0 && max_y - min_y > 0
        points = points.map do |x, y|
          [
            ((x - min_x) / (max_x - min_x)) * (width - 20) + 10,
            ((y - min_y) / (max_y - min_y)) * (height - 20) + 10
          ]
        end
      end
      
      # Draw the signature path
      draw.path("M #{points.first.join(',')} #{points[1..-1].map { |p| "L #{p.join(',')}" }.join(' ')}")
    end
    
    # Draw on the image
    draw.draw(image)
    
    # Convert to blob
    image.to_blob { |img| img.format = 'PNG' }
  rescue => e
    Rails.logger.error "Signature generation failed: #{e.message}"
    # Return a simple placeholder if generation fails
    Magick::Image.new(width, height) { |img| img.background_color = 'white' }.to_blob
  end
end