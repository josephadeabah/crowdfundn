# app/controllers/api/v1/members/premium_plans_controller.rb
module Api
  module V1
    module Members
      class PremiumPlansController < ApplicationController
        before_action :authenticate_request
        
        def index
          plans = PremiumPlan.active.order(:price)
          render json: {
            plans: plans.as_json(only: [:id, :name, :price, :currency, :interval, :description, :features])
          }, status: :ok
        end
      end
    end
  end
end