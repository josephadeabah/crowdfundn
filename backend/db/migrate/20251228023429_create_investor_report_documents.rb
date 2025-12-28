class CreateInvestorReportDocuments < ActiveRecord::Migration[7.1]
  def change
    create_table :investor_report_documents do |t|
      t.references :investor_report, null: false, foreign_key: true
      t.string :document_type, null: false # 'full_report', 'executive_summary', 'financials', 'presentation'
      t.string :title
      t.text :description
      t.string :file_format # 'pdf', 'xlsx', 'pptx', 'docx'
      t.integer :file_size
      t.string :language, default: 'en'
      t.boolean :is_public, default: false
      t.integer :download_count, default: 0
      t.jsonb :metadata, default: {}
      
      t.timestamps
    end

    add_index :investor_report_documents, [:investor_report_id, :document_type], 
              unique: true, name: 'idx_report_documents_report_type'
  end
end