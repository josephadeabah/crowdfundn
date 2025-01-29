module Api
    module V1
      module Points
        class PointsController < ApplicationController
            before_action :authenticate_request!, only: [:my_points]
  
          # Fetch user points
          def my_points
            total_points = current_user.point&.total_points || 0
            render json: { total_points: total_points }, status: :ok
          end
        end
      end
    end
end
  