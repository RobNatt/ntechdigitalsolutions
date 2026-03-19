import { useState } from 'react';
import './MultiStepLeadForm.css'; // We'll create this next

interface MultiStepLeadFormProps {
  variant?: 'roof-qualification' | 'roofer-qualification';
}

interface FormDataState {
  name: string;
  phone: string;
  email: string;
  leadType: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  verificationCode: string;
  propertyOwner: string;
  damages: string[];
  budget: string;
  insuranceCompany: string;
  claimFiledLastYear: string;
  companyName: string;
  serviceArea: string;
  targetRevenue: string;
  leadBudget: string;
  leadsPerMonth: string;
  landlordContact: string;
  landlordPermission: string;
  renterDamages: string[];
  renterUrgency: string;
}

export default function MultiStepLeadForm({ variant }: MultiStepLeadFormProps) {
  const showRenterOption = variant === 'roof-qualification';
  const [currentStep, setCurrentStep] = useState(1);
  const [leadType, setLeadType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<FormDataState>({
    // Step 1: Common fields
    name: '',
    phone: '',
    email: '',
    leadType: '',
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    
    // Step 2: Verification
    verificationCode: '',
    
    // Homeowner fields
    propertyOwner: '',
    damages: [] as string[],
    budget: '5000',
    insuranceCompany: '',
    claimFiledLastYear: '',
    
    // Roofer fields
    companyName: '',
    serviceArea: '',
    targetRevenue: '',
    leadBudget: '',
    leadsPerMonth: '',
    
    // Renter fields
    landlordContact: '',
    landlordPermission: '',
    renterDamages: [],
    renterUrgency: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleRenterDamage = (damage: string) => {
    setFormData(prev => ({
      ...prev,
      renterDamages: prev.renterDamages.includes(damage)
        ? prev.renterDamages.filter((d: string) => d !== damage)
        : [...prev.renterDamages, damage]
    }));
  };

  // Handle checkbox array (for damages)
  const toggleDamage = (damage: string) => {
    setFormData(prev => ({
      ...prev,
      damages: prev.damages.includes(damage)
        ? prev.damages.filter(d => d !== damage)
        : [...prev.damages, damage]
    }));
  };

  // Validate Step 1
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = "Valid phone number required";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.leadType) newErrors.leadType = "Please select who you are";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Continue to details (SMS verification bypassed for launch - add later)
  const goToDetailsStep = () => {
    if (!validateStep1()) return;
    setLeadType(formData.leadType);
    setCurrentStep(3);
  };

  // Validate Step 3 (Homeowner)
  const validateHomeownerStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.addressStreet.trim()) newErrors.addressStreet = "Street address required";
    if (!formData.addressCity.trim()) newErrors.addressCity = "City required";
    if (!formData.addressState.trim()) newErrors.addressState = "State required";
    if (!formData.addressZip.trim() || formData.addressZip.length < 5) newErrors.addressZip = "Valid ZIP required";
    if (!formData.propertyOwner) newErrors.propertyOwner = "Required";
    if (formData.damages.length === 0) newErrors.damages = "Select at least one";
    if (!formData.budget) newErrors.budget = "Required";
    if (!formData.insuranceCompany.trim()) newErrors.insuranceCompany = "Required";
    if (!formData.claimFiledLastYear) newErrors.claimFiledLastYear = "Required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 3 (Renter)
  const validateRenterStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.addressStreet.trim()) newErrors.addressStreet = "Street address required";
    if (!formData.addressCity.trim()) newErrors.addressCity = "City required";
    if (!formData.addressState.trim()) newErrors.addressState = "State required";
    if (!formData.addressZip.trim() || formData.addressZip.length < 5) newErrors.addressZip = "Valid ZIP required";
    if (!formData.landlordContact.trim()) newErrors.landlordContact = "Required";
    if (!formData.landlordPermission) newErrors.landlordPermission = "Required";
    if (formData.renterDamages.length === 0) newErrors.renterDamages = "Select at least one";
    if (!formData.renterUrgency) newErrors.renterUrgency = "Required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 3 (Roofer)
  const validateRooferStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.addressStreet.trim()) newErrors.addressStreet = "Street address required";
    if (!formData.addressCity.trim()) newErrors.addressCity = "City required";
    if (!formData.addressState.trim()) newErrors.addressState = "State required";
    if (!formData.addressZip.trim() || formData.addressZip.length < 5) newErrors.addressZip = "Valid ZIP required";
    if (!formData.companyName.trim()) newErrors.companyName = "Required";
    if (!formData.serviceArea.trim()) newErrors.serviceArea = "Required";
    if (!formData.targetRevenue) newErrors.targetRevenue = "Required";
    if (!formData.leadBudget) newErrors.leadBudget = "Required";
    if (!formData.leadsPerMonth) newErrors.leadsPerMonth = "Required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Final submission - save to Supabase via API
  const handleFinalSubmit = async () => {
    const isValid = leadType === 'homeowner' 
      ? validateHomeownerStep() 
      : leadType === 'renter'
        ? validateRenterStep()
        : validateRooferStep();
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    const source = variant === 'roof-qualification' ? 'lead_roofing' : variant === 'roofer-qualification' ? 'client_roofing' : 'unknown';
    const address = [formData.addressStreet, formData.addressCity, formData.addressState, formData.addressZip]
      .filter(Boolean)
      .join(', ');
    
    try {
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, address, source })
      });

      let data: { error?: string; hint?: string };
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        alert(`Server error (${response.status}). Check Vercel logs.\n\n${text.slice(0, 200)}`);
        return;
      }

      if (response.ok) {
        setSubmitted(true);
      } else {
        const msg = data.hint ? `${data.error}\n\n(Details: ${data.hint})` : (data.error || 'Error submitting form. Please try again.');
        alert(msg);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message
  if (submitted) {
    return (
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h2>Successful</h2>
        <p className="success-message">
          A representative will reach out to you in the next hour to discuss your concerns and
          confirm an appointment date and time with you. If you miss their call, they will call
          you at least 3 times to take care of you.
        </p>
        <p className="success-thanks">Thank you!</p>
      </div>
    );
  }

  return (
    <div className="multi-step-form">
      {/* Progress Bar - 2 steps (Contact → Details) */}
      <div className="progress-bar">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Contact Info</div>
        </div>
        <div className={`progress-line ${currentStep >= 3 ? 'active' : ''}`}></div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Details</div>
        </div>
      </div>

      {/* Step 1: Common Fields */}
      {currentStep === 1 && (
        <div className="form-step">
          <h2>Let's Get Started</h2>
          <p>Tell us a bit about yourself</p>

          <div className="form-group">
            <label>I am a...</label>
            <div className="radio-group">
              <label className={`radio-option ${formData.leadType === 'homeowner' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="leadType"
                  value="homeowner"
                  checked={formData.leadType === 'homeowner'}
                  onChange={(e) => updateField('leadType', e.target.value)}
                />
                <div className="radio-content">
                  <span className="radio-title">🏠 Homeowner</span>
                  <span className="radio-subtitle">I need roofing work</span>
                </div>
              </label>

              {showRenterOption ? (
                <label className={`radio-option ${formData.leadType === 'renter' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="leadType"
                    value="renter"
                    checked={formData.leadType === 'renter'}
                    onChange={(e) => updateField('leadType', e.target.value)}
                  />
                  <div className="radio-content">
                    <span className="radio-title">🔑 Renter</span>
                    <span className="radio-subtitle">I rent and need to report roofing issues</span>
                  </div>
                </label>
              ) : (
                <label className={`radio-option ${formData.leadType === 'roofer' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="leadType"
                    value="roofer"
                    checked={formData.leadType === 'roofer'}
                    onChange={(e) => updateField('leadType', e.target.value)}
                  />
                  <div className="radio-content">
                    <span className="radio-title">🏢 Roofing Company</span>
                    <span className="radio-subtitle">I want to buy leads</span>
                  </div>
                </label>
              )}
            </div>
            {errors.leadType && <span className="error">{errors.leadType}</span>}
          </div>

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="John Smith"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@example.com"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <button 
            className="btn-primary"
            onClick={goToDetailsStep}
            disabled={isSubmitting}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 2: Homeowner-Specific Questions */}
      {currentStep === 3 && leadType === 'homeowner' && (
        <div className="form-step">
          <h2>About Your Property</h2>
          <p>Help us understand your roofing needs</p>

          <div className="form-group">
            <label>Property Address *</label>
            <input
              type="text"
              value={formData.addressStreet}
              onChange={(e) => updateField('addressStreet', e.target.value)}
              placeholder="Street address"
            />
            {errors.addressStreet && <span className="error">{errors.addressStreet}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={formData.addressCity}
                onChange={(e) => updateField('addressCity', e.target.value)}
                placeholder="City"
              />
              {errors.addressCity && <span className="error">{errors.addressCity}</span>}
            </div>
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                value={formData.addressState}
                onChange={(e) => updateField('addressState', e.target.value)}
                placeholder="State"
              />
              {errors.addressState && <span className="error">{errors.addressState}</span>}
            </div>
            <div className="form-group">
              <label>ZIP Code *</label>
              <input
                type="text"
                value={formData.addressZip}
                onChange={(e) => updateField('addressZip', e.target.value)}
                placeholder="ZIP"
              />
              {errors.addressZip && <span className="error">{errors.addressZip}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Are you the property owner? *</label>
            <div className="radio-group-inline">
              <label>
                <input
                  type="radio"
                  name="propertyOwner"
                  value="yes"
                  checked={formData.propertyOwner === 'yes'}
                  onChange={(e) => updateField('propertyOwner', e.target.value)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="propertyOwner"
                  value="no"
                  checked={formData.propertyOwner === 'no'}
                  onChange={(e) => updateField('propertyOwner', e.target.value)}
                />
                No
              </label>
            </div>
            {errors.propertyOwner && <span className="error">{errors.propertyOwner}</span>}
          </div>

          <div className="form-group">
            <label>What damages are you concerned with? * (Select all that apply)</label>
            <div className="checkbox-group">
              {[
                { value: 'leak', label: '💧 Leaking' },
                { value: 'missing-shingles', label: '🏚️ Missing shingles' },
                { value: 'hail-damage', label: '🌨️ Hail damage' },
                { value: 'wind-damage', label: '💨 Wind damage' },
                { value: 'age', label: '⏰ Old roof (wear & tear)' },
                { value: 'sagging', label: '📉 Sagging/structural' },
                { value: 'other', label: '🔧 Other damage' },
              ].map(damage => (
                <label key={damage.value} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData.damages.includes(damage.value)}
                    onChange={() => toggleDamage(damage.value)}
                  />
                  {damage.label}
                </label>
              ))}
            </div>
            {errors.damages && <span className="error">{errors.damages}</span>}
          </div>

          <div className="form-group">
            <label>What is your budget for the repair? *</label>
            <div className="budget-slider-container">
              <span className="budget-value">
                ${Number(formData.budget || 5000).toLocaleString()}
              </span>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={formData.budget || 5000}
                onChange={(e) => updateField('budget', e.target.value)}
                className="budget-slider"
              />
              <div className="budget-range-labels">
                <span>$500</span>
                <span>$50,000</span>
              </div>
            </div>
            <small>We're doing an initial inspection free of charge</small>
            {errors.budget && <span className="error">{errors.budget}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="insurance-company">Who is your insurance company? *</label>
            <input
              id="insurance-company"
              type="text"
              name="insuranceCompany"
              value={formData.insuranceCompany}
              onChange={(e) => updateField('insuranceCompany', e.target.value)}
              placeholder="e.g., State Farm, Allstate, USAA"
              autoComplete="organization"
            />
            {errors.insuranceCompany && <span className="error">{errors.insuranceCompany}</span>}
          </div>

          <div className="form-group">
            <label>Did you file a claim in the last year? *</label>
            <div className="radio-group-inline">
              <label>
                <input
                  type="radio"
                  name="claimFiledLastYear"
                  value="yes"
                  checked={formData.claimFiledLastYear === 'yes'}
                  onChange={(e) => updateField('claimFiledLastYear', e.target.value)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="claimFiledLastYear"
                  value="no"
                  checked={formData.claimFiledLastYear === 'no'}
                  onChange={(e) => updateField('claimFiledLastYear', e.target.value)}
                />
                No
              </label>
            </div>
            {errors.claimFiledLastYear && <span className="error">{errors.claimFiledLastYear}</span>}
          </div>

          <div className="button-group">
            <button 
              className="btn-secondary"
              onClick={() => setCurrentStep(1)}
            >
              ← Back
            </button>
            <button 
              className="btn-primary"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3B: Renter-Specific Questions (lead_roofing page) */}
      {currentStep === 3 && leadType === 'renter' && (
        <div className="form-step">
          <h2>About Your Rental</h2>
          <p>We&apos;ll help you get your landlord to address roofing issues</p>

          <div className="form-group">
            <label>Property Address *</label>
            <input
              type="text"
              value={formData.addressStreet}
              onChange={(e) => updateField('addressStreet', e.target.value)}
              placeholder="Street address"
            />
            {errors.addressStreet && <span className="error">{errors.addressStreet}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={formData.addressCity}
                onChange={(e) => updateField('addressCity', e.target.value)}
                placeholder="City"
              />
              {errors.addressCity && <span className="error">{errors.addressCity}</span>}
            </div>
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                value={formData.addressState}
                onChange={(e) => updateField('addressState', e.target.value)}
                placeholder="State"
              />
              {errors.addressState && <span className="error">{errors.addressState}</span>}
            </div>
            <div className="form-group">
              <label>ZIP Code *</label>
              <input
                type="text"
                value={formData.addressZip}
                onChange={(e) => updateField('addressZip', e.target.value)}
                placeholder="ZIP"
              />
              {errors.addressZip && <span className="error">{errors.addressZip}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Landlord or Property Manager Contact *</label>
            <input
              type="text"
              value={formData.landlordContact}
              onChange={(e) => updateField('landlordContact', e.target.value)}
              placeholder="Name, phone, or email"
            />
            {errors.landlordContact && <span className="error">{errors.landlordContact}</span>}
          </div>

          <div className="form-group">
            <label>Do you have permission to request an inspection? *</label>
            <div className="radio-group-inline">
              <label>
                <input
                  type="radio"
                  name="landlordPermission"
                  value="yes"
                  checked={formData.landlordPermission === 'yes'}
                  onChange={(e) => updateField('landlordPermission', e.target.value)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="landlordPermission"
                  value="no"
                  checked={formData.landlordPermission === 'no'}
                  onChange={(e) => updateField('landlordPermission', e.target.value)}
                />
                No / Not sure
              </label>
            </div>
            {errors.landlordPermission && <span className="error">{errors.landlordPermission}</span>}
          </div>

          <div className="form-group">
            <label>What issues are you seeing? * (Select all that apply)</label>
            <div className="checkbox-group">
              {[
                { value: 'leak', label: '💧 Leaking' },
                { value: 'missing-shingles', label: '🏚️ Missing shingles' },
                { value: 'hail-damage', label: '🌨️ Hail damage' },
                { value: 'wind-damage', label: '💨 Wind damage' },
                { value: 'age', label: '⏰ Old roof (wear & tear)' },
                { value: 'sagging', label: '📉 Sagging/structural' },
                { value: 'other', label: '🔧 Other damage' },
              ].map(damage => (
                <label key={damage.value} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData.renterDamages.includes(damage.value)}
                    onChange={() => toggleRenterDamage(damage.value)}
                  />
                  {damage.label}
                </label>
              ))}
            </div>
            {errors.renterDamages && <span className="error">{errors.renterDamages}</span>}
          </div>

          <div className="form-group">
            <label>How urgent is the issue? *</label>
            <select
              value={formData.renterUrgency}
              onChange={(e) => updateField('renterUrgency', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="emergency">Emergency (active leak, safety concern)</option>
              <option value="soon">Soon (needs attention in weeks)</option>
              <option value="eventually">Eventually (planning ahead)</option>
            </select>
            {errors.renterUrgency && <span className="error">{errors.renterUrgency}</span>}
          </div>

          <div className="button-group">
            <button 
              className="btn-secondary"
              onClick={() => setCurrentStep(1)}
            >
              ← Back
            </button>
            <button 
              className="btn-primary"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3C: Roofer-Specific Questions (client_roofing page) */}
      {currentStep === 3 && leadType === 'roofer' && (
        <div className="form-step">
          <h2>About Your Business</h2>
          <p>Help us understand your lead needs</p>

          <div className="form-group">
            <label>Business Address *</label>
            <input
              type="text"
              value={formData.addressStreet}
              onChange={(e) => updateField('addressStreet', e.target.value)}
              placeholder="Street address"
            />
            {errors.addressStreet && <span className="error">{errors.addressStreet}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={formData.addressCity}
                onChange={(e) => updateField('addressCity', e.target.value)}
                placeholder="City"
              />
              {errors.addressCity && <span className="error">{errors.addressCity}</span>}
            </div>
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                value={formData.addressState}
                onChange={(e) => updateField('addressState', e.target.value)}
                placeholder="State"
              />
              {errors.addressState && <span className="error">{errors.addressState}</span>}
            </div>
            <div className="form-group">
              <label>ZIP Code *</label>
              <input
                type="text"
                value={formData.addressZip}
                onChange={(e) => updateField('addressZip', e.target.value)}
                placeholder="ZIP"
              />
              {errors.addressZip && <span className="error">{errors.addressZip}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="ABC Roofing Co."
            />
            {errors.companyName && <span className="error">{errors.companyName}</span>}
          </div>

          <div className="form-group">
            <label>Service Area *</label>
            <input
              type="text"
              value={formData.serviceArea}
              onChange={(e) => updateField('serviceArea', e.target.value)}
              placeholder="e.g., Dallas-Fort Worth Metro, Zip codes 75001-75099"
            />
            <small>Which areas do you serve?</small>
            {errors.serviceArea && <span className="error">{errors.serviceArea}</span>}
          </div>

          <div className="form-group">
            <label>Target Annual Revenue *</label>
            <select
              value={formData.targetRevenue}
              onChange={(e) => updateField('targetRevenue', e.target.value)}
            >
              <option value="">Select range...</option>
              <option value="under-500k">Under $500K</option>
              <option value="500k-1m">$500K - $1M</option>
              <option value="1m-5m">$1M - $5M</option>
              <option value="5m-plus">$5M+</option>
            </select>
            {errors.targetRevenue && <span className="error">{errors.targetRevenue}</span>}
          </div>

          <div className="form-group">
            <label>Monthly Budget for Leads *</label>
            <select
              value={formData.leadBudget}
              onChange={(e) => updateField('leadBudget', e.target.value)}
            >
              <option value="">Select budget...</option>
              <option value="under-1k">Under $1,000</option>
              <option value="1k-3k">$1,000 - $3,000</option>
              <option value="3k-5k">$3,000 - $5,000</option>
              <option value="5k-10k">$5,000 - $10,000</option>
              <option value="10k-plus">$10,000+</option>
            </select>
            {errors.leadBudget && <span className="error">{errors.leadBudget}</span>}
          </div>

          <div className="form-group">
            <label>How many leads would you want to start with? *</label>
            <select
              value={formData.leadsPerMonth}
              onChange={(e) => updateField('leadsPerMonth', e.target.value)}
            >
              <option value="">Select volume...</option>
              <option value="5-10">5-10 leads/month</option>
              <option value="10-20">10-20 leads/month</option>
              <option value="20-50">20-50 leads/month</option>
              <option value="50-plus">50+ leads/month</option>
            </select>
            {errors.leadsPerMonth && <span className="error">{errors.leadsPerMonth}</span>}
          </div>

          <div className="button-group">
            <button 
              className="btn-secondary"
              onClick={() => setCurrentStep(1)}
            >
              ← Back
            </button>
            <button 
              className="btn-primary"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}