# app/policies/kyc_policy.rb
class KycPolicy < ApplicationPolicy
  def show?
    record.user == user || user.admin?
  end

  def create?
    # User can create KYC if they don't have a pending or verified one
    user.kycs.where(status: ['pending', 'in_review', 'verified']).empty?
  end

  def update?
    record.user == user && (record.pending? || record.in_review?)
  end

  def submit?
    record.user == user && record.pending?
  end

  def destroy?
    record.user == user && (record.pending? || record.in_review?)
  end

  def admin_review?
    user.admin?
  end

  def admin_verify?
    user.admin? && (record.pending? || record.in_review?)
  end

  def admin_reject?
    user.admin? && (record.pending? || record.in_review?)
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