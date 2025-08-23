# app/services/signature_image_generator.rb
class SignatureImageGenerator
  def self.generate(signature_data, width: 400, height: 200, background_color: 'white', stroke_color: 'black')
    require 'rmagick'
    
    # Create a new image with specified background
    image = Magick::Image.new(width, height) do |img|
      img.background_color = background_color
    end
    
    draw = Magick::Draw.new
    
    # Set drawing properties
    draw.stroke(stroke_color)
    draw.stroke_width(3)
    draw.fill('transparent')
    draw.stroke_linejoin('round')
    draw.stroke_linecap('round')
    
    # Draw the signature if we have data
    if signature_data.is_a?(Array) && signature_data.any?
      # Convert to array of points (handle both symbol and string keys)
      points = signature_data.map do |point|
        x = point.is_a?(Hash) ? (point[:x] || point['x']).to_f : 0
        y = point.is_a?(Hash) ? (point[:y] || point['y']).to_f : 0
        [x, y]
      end
      
      # Remove any invalid points
      points.reject! { |x, y| x.nil? || y.nil? }
      
      if points.any?
        # Find min/max to normalize coordinates
        x_values = points.map(&:first)
        y_values = points.map(&:last)
        
        min_x = x_values.min
        max_x = x_values.max
        min_y = y_values.min
        max_y = y_values.max
        
        # Scale points to fit canvas with padding
        if max_x - min_x > 0 && max_y - min_y > 0
          points = points.map do |x, y|
            scaled_x = ((x - min_x) / (max_x - min_x)) * (width - 40) + 20
            scaled_y = ((y - min_y) / (max_y - min_y)) * (height - 40) + 20
            [scaled_x, scaled_y]
          end
        end
        
        # Draw the signature path
        path_commands = ["M #{points.first.join(',')}"]
        path_commands += points[1..-1].map { |p| "L #{p.join(',')}" }
        
        draw.path(path_commands.join(' '))
      end
    end
    
    # Draw on the image
    draw.draw(image)
    
    # Convert to blob
    image.to_blob { |img| img.format = 'PNG' }
  rescue => e
    Rails.logger.error "Signature generation failed: #{e.message}\n#{e.backtrace.join("\n")}"
    # Return a simple placeholder if generation fails
    Magick::Image.new(width, height) { |img| img.background_color = background_color }.to_blob
  end
end