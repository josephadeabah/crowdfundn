# lib/active_storage/service/supabase_storage.rb
require "active_storage/service"
require "faraday"
require "mime-types"
require "tempfile"
require "stringio"

module ActiveStorage
  class Service::SupabaseStorageService < Service
    attr_reader :client, :bucket, :public, :supabase_url, :api_key

    def initialize(bucket:, public: true, **options)
      @bucket = bucket
      @public = public
      @supabase_url = options[:supabase_url] || ENV.fetch("SUPABASE_URL")
      @api_key = options[:api_key] || ENV.fetch("SUPABASE_SERVICE_ROLE_KEY")
      @client = options[:client] || $supabase_client
      
      if @client.nil?
        @client = Supabase.create_client(
          supabase_url: @supabase_url,
          supabase_key: @api_key
        )
      end
    end

    def upload(key, io, checksum: nil, content_type: nil, **)
      instrument :upload, key: key, checksum: checksum do
        content_type ||= MIME::Types.type_for(key).first&.content_type || "application/octet-stream"
        
        file_to_upload = io
        if io.is_a?(StringIO)
          temp_file = Tempfile.new(["upload", File.extname(key)])
          temp_file.binmode
          temp_file.write(io.read)
          temp_file.rewind
          file_to_upload = temp_file
        end
        
        begin
          response = @client.storage.from(@bucket).upload(
            key, 
            file_to_upload, 
            content_type: content_type,
            cache_control: "max-age=31536000, public"
          )
          
          if response.status != 200 && response.status != 201
            raise "Failed to upload file: #{response.body}"
          end
          
          response
        ensure
          if file_to_upload.is_a?(Tempfile)
            file_to_upload.close
            file_to_upload.unlink
          end
        end
      end
    end

    def download(key, &block)
      instrument :download, key: key do
        response = @client.storage.from(@bucket).download(key)
        
        if response.status != 200
          raise "Failed to download file: #{response.body}"
        end
        
        if block_given?
          yield response.body
        else
          response.body
        end
      end
    end

    def download_chunk(key, range)
      instrument :download_chunk, key: key, range: range do
        response = @client.storage.from(@bucket).download(key)
        
        if response.status != 200
          raise "Failed to download chunk: #{response.body}"
        end
        
        body = response.body
        start_byte, end_byte = range.split("-").map(&:to_i)
        body.byteslice(start_byte..(end_byte || -1))
      end
    end

    def delete(key)
      instrument :delete, key: key do
        @client.storage.from(@bucket).remove([key])
      rescue => e
        Rails.logger.error "Error deleting file #{key}: #{e.message}"
        false
      end
    end

    def delete_prefixed(prefix)
      instrument :delete_prefixed, prefix: prefix do
        files = list_files(prefix)
        if files.any?
          @client.storage.from(@bucket).remove(files.map { |f| f[:name] })
        end
        true
      end
    end

    def exist?(key)
      instrument :exist, key: key do
        files = list_files(key)
        files.any?
      end
    end

    def url(key, expires_in: nil, filename: nil, disposition: nil, content_type: nil)
      instrument :url, key: key do
        if @public
          "#{@supabase_url}/storage/v1/object/public/#{@bucket}/#{key}"
        elsif expires_in
          response = @client.storage.from(@bucket).create_signed_url(key, expires_in.to_i)
          response.body["signedUrl"] if response.status == 200
        else
          "#{@supabase_url}/storage/v1/object/public/#{@bucket}/#{key}"
        end
      end
    end

    def url_for_direct_upload(key, expires_in:, content_type:, content_length:, checksum: nil)
      instrument :url_for_direct_upload, key: key do
        response = @client.storage.from(@bucket).create_signed_upload_url(key, expires_in.to_i)
        if response.status == 200
          response.body["signedUrl"]
        else
          raise "Failed to get signed upload URL: #{response.body}"
        end
      end
    end

    def headers_for_direct_upload(key, content_type:, **)
      {
        "Content-Type" => content_type,
        "Cache-Control" => "max-age=31536000, public"
      }
    end

    private

    def list_files(prefix)
      response = @client.storage.from(@bucket).list(prefix)
      if response.status == 200
        response.body || []
      else
        []
      end
    rescue => e
      Rails.logger.error "Error listing files: #{e.message}"
      []
    end
  end
end