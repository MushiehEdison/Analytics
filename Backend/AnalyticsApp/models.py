from datetime import datetime
from . import db, login_manager
from flask_login import UserMixin
from sqlalchemy import JSON

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    role = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(15), nullable=False, unique=True)

    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    company = db.relationship('Company', back_populates='users')

    # Relationship with EmployeeData
    employee_data = db.relationship('EmployeeData', back_populates='user')

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.fullname}')"


class Company(db.Model):
    __tablename__ = 'company'
    id = db.Column(db.Integer, primary_key=True)
    companyName = db.Column(db.String(60), nullable=False)
    companyLogo = db.Column(db.String(120), nullable=True, unique=False, default='static/logo/companyLogo.jpeg')
    industry = db.Column(db.String(60), nullable=False)
    numberOfEmployee = db.Column(db.Integer, nullable=True)
    annualRevenue = db.Column(db.Integer, nullable=True)
    legalStructure = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    companyContact = db.Column(db.String(20), nullable=False, unique=True)
    website = db.Column(db.String(50), nullable=True)
    DateOfCreation = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    users = db.relationship('User', back_populates='company')
    inventories = db.relationship('Inventory', back_populates='company')
    employees = db.relationship('EmployeeData', back_populates='company')
    performances = db.relationship('EmployeePerformance', back_populates='company')
    finances = db.relationship('FinancialData', back_populates='company')
    feedbacks = db.relationship('CustomerFeedback', back_populates='company')
    campaigns = db.relationship('MarketingCampaign', back_populates='company')
    alerts = db.relationship('Alerts', back_populates='company')
    compliances = db.relationship('LegalCompliance', back_populates='company')
    reports = db.relationship('Report', back_populates='company')
    risks = db.relationship('Risk', back_populates='company')
    sales = db.relationship('SalesData', back_populates='company')
    operations = db.relationship('Operation', back_populates='company')
    uploadedfile = db.relationship('UploadedFile', back_populates='company')
    def __repr__(self):
        return f"Company('{self.companyName}')"

class Inventory(db.Model):
    __tablename__ = 'inventory'
    InventoryID = db.Column(db.Integer, primary_key=True)
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    ProductName = db.Column(db.String(100), nullable=True)
    StockCount = db.Column(db.Integer, nullable=True)
    SoldToday = db.Column(db.Integer, nullable=True)
    TotalSales = db.Column(db.Float, nullable=True)
    PurchaseToday = db.Column(db.Integer, nullable=True)
    ProducedToday = db.Column(db.Integer, nullable=True)
    DamageOrLost = db.Column(db.Integer, nullable=True)
    ReturnRate = db.Column(db.Float, nullable=True)
    Date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    company = db.relationship('Company', back_populates='inventories')

    def __repr__(self):
        return f"<Inventory {self.ProductName}>"

class EmployeeData(db.Model):
    __tablename__ = 'employee_data'
    EmployeeID = db.Column(db.Integer, primary_key=True)
    UserID = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Link to User table
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    hirededToday = db.Column(db.Integer, nullable=True)
    ResignDate = db.Column(db.Date, nullable=True)
    DateofEntry = db.Column(db.Date, nullable=False)
    EmployeeName = db.Column(db.String(100), nullable=True)


    # Relationships
    user = db.relationship('User', back_populates='employee_data')
    company = db.relationship('Company', back_populates='employees')
    performances = db.relationship('EmployeePerformance', back_populates='employee')

    def __repr__(self):
        return f"<EmployeeData {self.EmployeeID}>"


class EmployeePerformance(db.Model):
    __tablename__ = 'employee_performance'
    empPerformanceID = db.Column(db.Integer, primary_key=True)
    EmployeeID = db.Column(db.Integer, db.ForeignKey('employee_data.EmployeeID'), nullable=False)
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    Taskcompleted = db.Column(db.Integer, nullable=True)
    HoursOfWork = db.Column(db.Float, nullable=True)
    PerformanceRating = db.Column(db.Float, nullable=True)
    HealthCondition = db.Column(db.String(100), nullable=True)
    ReviewDate = db.Column(db.Date, nullable=False)
    ProjectStatus = db.Column(db.String(255), nullable=True)
    Attendance = db.Column(db.String(50), nullable=True)
    Overtime = db.Column(db.Float, nullable=True)
    QualityOfWork = db.Column(db.String(255), nullable=True)
    CommentsNotes = db.Column(db.Text, nullable=True)

    company = db.relationship('Company', back_populates='performances')
    employee = db.relationship('EmployeeData', back_populates='performances')

    def __repr__(self):
        return f"<EmployeePerformance {self.empPerformanceID}>"


class FinancialData(db.Model):
    __tablename__ = 'financial_data'
    ID = db.Column(db.Integer, primary_key=True)
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    RevenueFigure = db.Column(db.Float, nullable=True)
    Profit_and_loss = db.Column(db.Float, nullable=True)
    Expenses = db.Column(db.Float, nullable=True)
    Liabilities = db.Column(db.Float, nullable=True)
    Period = db.Column(db.String(50), nullable=False)
    GrossProfit = db.Column(db.Float, nullable=True)
    NetProfit = db.Column(db.Float, nullable=True)
    InventoryChange = db.Column(db.Float, nullable=True)
    AccountsReceivable = db.Column(db.Float, nullable=True)
    AccountsPayable = db.Column(db.Float, nullable=True)
    OperatingCashFlow = db.Column(db.Float, nullable=True)
    InvestingCashFlow = db.Column(db.Float, nullable=True)
    FinancingCashFlow = db.Column(db.Float, nullable=True)
    TaxPayments = db.Column(db.Float, nullable=True)
    extracted_data = db.Column(JSON, nullable=True)

    company = db.relationship('Company', back_populates='finances')

    def __repr__(self):
        return f"<FinancialData {self.ID}>"


class CustomerFeedback(db.Model):
    __tablename__ = 'customer_feedback'
    feedbackID = db.Column(db.Integer, primary_key=True)
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    CustomerName = db.Column(db.String(100), nullable=False)
    Feedback = db.Column(db.Text, nullable=True)
    Date = db.Column(db.Date, nullable=False)
    ResolutionStatus = db.Column(db.String(50), nullable=True)
    Rating = db.Column(db.Float, nullable=True)
    extracted_data = db.Column(JSON, nullable=True)

    company = db.relationship('Company', back_populates='feedbacks')

    def __repr__(self):
        return f"<CustomerFeedback {self.CustomerName}>"


class MarketingCampaign(db.Model):
    __tablename__ = 'marketing_campaign'
    CampaignID = db.Column(db.Integer, primary_key=True)
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    Budget = db.Column(db.Float, nullable=True)
    CampaignName = db.Column(db.String(100), nullable=False)  # Specify length for VARCHAR
    Platforms = db.Column(db.String(100), nullable=True)  # Specify length for VARCHAR
    EngagementRates = db.Column(db.Float, nullable=True)
    Outcomes = db.Column(db.Text, nullable=True)
    Reactions = db.Column(db.Text, nullable=True)
    Date = db.Column(db.Date, nullable=False)
    extracted_data = db.Column(JSON, nullable=True)

    company = db.relationship('Company', back_populates='campaigns')

    def __repr__(self):
        return f"<MarketingCampaign {self.CampaignName}>"


class Alerts(db.Model):
    __tablename__ = 'alerts'
    AlertID = db.Column(db.Integer, primary_key=True)
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    AlertContent = db.Column(db.Text, nullable=True)
    Date = db.Column(db.Date, nullable=False)
    Status = db.Column(db.String(50), nullable=True)

    company = db.relationship('Company', back_populates='alerts')

    def __repr__(self):
        return f"<Alerts {self.AlertID}>"

class LegalCompliance(db.Model):
    __tablename__ = 'legal_compliance'
    ComplianceID = db.Column(db.Integer, primary_key=True)
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    Status = db.Column(db.String(100), nullable=True)
    IssueReport = db.Column(db.Text, nullable=True)
    LastCheckDate = db.Column(db.Date, nullable=True)
    NextCheckDate = db.Column(db.Date, nullable=True)

    company = db.relationship('Company', back_populates='compliances')

    def __repr__(self):
        return f"<LegalCompliance {self.ComplianceID}>"
class Report(db.Model):
    __tablename__ = 'report'
    ReportID = db.Column(db.Integer, primary_key=True)
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    Timeframe = db.Column(db.String(50), nullable=False)
    generatedOn = db.Column(db.Date, nullable=False)
    SummaryData = db.Column(db.Text, nullable=True)

    company = db.relationship('Company', back_populates='reports')

    def __repr__(self):
        return f"<Report {self.ReportID}>"

class Risk(db.Model):
    __tablename__ = 'risk'
    RiskID = db.Column(db.Integer, primary_key=True)
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    RiskTitle = db.Column(db.String(100), nullable=False)
    Description = db.Column(db.Text, nullable=True)
    Severity = db.Column(db.String(50), nullable=True)
    MitigationPlan = db.Column(db.Text, nullable=True)
    Date = db.Column(db.Date, nullable=False)

    company = db.relationship('Company', back_populates='risks')

    def __repr__(self):
        return f"<Risk {self.RiskTitle}>"
class SalesData(db.Model):
    __tablename__ = 'sales_data'
    id = db.Column(db.Integer, primary_key=True)
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    ItemName = db.Column(db.String(50), nullable=False)
    UnitPrice = db.Column(db.Float, nullable=False)
    TotalSalesRevenue = db.Column(db.Float, nullable=False)
    UnitsSold = db.Column(db.Integer, nullable=False)
    ReturningCustomerCount = db.Column(db.Integer, nullable=False)
    NewCustomerCount = db.Column(db.Integer, nullable=True, default=0)
    Date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    extracted_data = db.Column(JSON, nullable=True)

    company = db.relationship('Company', back_populates='sales')

    def __repr__(self):
        return f"SalesData('{self.TotalSalesRevenue}', '{self.UnitsSold}', '{self.Date}')"

class Operation(db.Model):
    __tablename__ = 'operations'

    operation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    CompanyID = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    operation_type = db.Column(db.String(100), nullable=False)  # Type of operation    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=True)  # Responsible employee
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.Enum('Pending', 'Ongoing', 'Completed', 'Failed'), nullable=False)
    cost = db.Column(db.Float, default=0.0)
    output = db.Column(db.Integer, default=0)
    defective_units = db.Column(db.Integer, default=0)
    downtime = db.Column(db.Float, default=0.0)
    resource_utilization = db.Column(db.Float, default=0.0)
    operating_hours = db.Column(db.Float, default=0.0)
    worker_attendance = db.Column(db.Integer, default=0)
    energy_consumption = db.Column(db.Float, default=0.0)
    overtime_hours = db.Column(db.Float, default=0.0)
    description = db.Column(db.String(255), nullable=True)
    materials = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())  # Last update time
    extracted_data = db.Column(JSON, nullable=True)

    company = db.relationship('Company', back_populates='operations')

    def __repr__(self):
        return f"<Operation {self.operation_id}, Type: {self.operation_type}, Status: {self.status}>"

class UploadedFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    filename = db.Column(db.String(255))
    file_path = db.Column(db.String(255))  # Store file path instead of data
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    file_type = db.Column(db.String(100))
    section = db.Column(db.String(100))

    company = db.relationship('Company', back_populates='uploadedfile')
