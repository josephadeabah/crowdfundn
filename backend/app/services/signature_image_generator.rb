# app/services/signature_image_generator.rb
require 'mini_magick'

class SignatureImageGenerator
  def self.generate(signature_data, width: 400, height: 200, background_color: 'white', stroke_color: 'black')
    # Create SVG content
    svg_content = generate_svg(signature_data, width, height, background_color, stroke_color)
    
    # Convert SVG to PNG using MiniMagick
    image = MiniMagick::Image.read(svg_content) do |img|
      img.format 'svg'
    end
    
    image.format 'png'
    image.to_blob
  rescue => e
    Rails.logger.error "Signature generation failed: #{e.message}\n#{e.backtrace.join("\n")}"
    # Return a simple placeholder if generation fails
    create_placeholder_image(width, height, background_color)
  end

  private

  def self.generate_svg(signature_data, width, height, background_color, stroke_color)
    points = normalize_points(signature_data, width, height)
    
    return simple_placeholder_svg(width, height, background_color) if points.empty?
    
    # Build SVG path
    path_data = points.map.with_index do |point, index|
      "#{index == 0 ? 'M' : 'L'} #{point[:x]},#{point[:y]}"
    end.join(' ')
    
    <<~SVG
      <svg width="#{width}" height="#{height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#{background_color}"/>
        <path d="#{path_data}" stroke="#{stroke_color}" stroke-width="3" fill="none" 
               stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    SVG
  end

  def self.normalize_points(signature_data, width, height)
    return [] unless signature_data.is_a?(Array) && signature_data.any?
    
    # Convert to array of points (handle both symbol and string keys)
    points = signature_data.map do |point|
      x = point.is_a?(Hash) ? (point[:x] || point['x']).to_f : 0
      y = point.is_a?(Hash) ? (point[:y] || point['y']).to_f : 0
      { x: x, y: y }
    end
    
    # Remove any invalid points
    points.reject! { |p| p[:x].nil? || p[:y].nil? }
    return [] if points.empty?
    
    # Find min/max to normalize coordinates
    x_values = points.map { |p| p[:x] }
    y_values = points.map { |p| p[:y] }
    
    min_x = x_values.min
    max_x = x_values.max
    min_y = y_values.min
    max_y = y_values.max
    
    # Scale points to fit canvas with padding
    if max_x - min_x > 0 && max_y - min_y > 0
      points.map do |point|
        {
          x: ((point[:x] - min_x) / (max_x - min_x)) * (width - 40) + 20,
          y: ((point[:y] - min_y) / (max_y - min_y)) * (height - 40) + 20
        }
      end
    else
      points
    end
  end

  def self.simple_placeholder_svg(width, height, background_color)
    <<~SVG
      <svg width="#{width}" height="#{height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#{background_color}"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" 
              font-size="14" fill="#ccc">No Signature</text>
      </svg>
    SVG
  end

  def self.create_placeholder_image(width, height, background_color)
    # Create a simple placeholder image using MiniMagick
    image = MiniMagick::Image.new(width, height) do |cmd|
      cmd.background background_color
      cmd.fill '#ccc'
      cmd.gravity 'center'
      cmd.pointsize '14'
      cmd.annotate '+0+0', 'No Signature'
    end
    image.format 'png'
    image.to_blob
  end
end