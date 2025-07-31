class KycPolicy < ApplicationPolicy
  def index?
    user.admin? || user == record.user
  end

  def show?
    user.admin? || user == record.user
  end

  def create?
    !user.admin? && (user.investor? || user.campaigns.any?)
  end

  def update?
    user.admin? || (user == record.user && record.pending?)
  end

  def verify?
    user.admin? && (record.pending? || record.rejected?)
  end

  def reject?
    user.admin? && record.pending?
  end

  class Scope < Scope
    def resolve
      if user.admin?
        scope.all
      else
        scope.where(user: user)
      end
    end
  end
end