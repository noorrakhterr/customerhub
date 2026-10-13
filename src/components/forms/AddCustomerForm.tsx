import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { RISK_LEVELS, RISK_LEVEL_LABELS } from '../../data/priority';
import type { CtaType, NewCustomer, RiskLevel } from '../../types/customer';

interface AddCustomerFormProps {
  onClose: () => void;
  onSubmit: (input: NewCustomer) => void;
}

const CTA_TYPES: CtaType[] = ['Value Accelerator', 'OCI', 'OWI', 'AMFA'];

export function AddCustomerForm({ onClose, onSubmit }: AddCustomerFormProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [accountExecutive, setAccountExecutive] = useState('');
  const [ctaType, setCtaType] = useState<CtaType>('Value Accelerator');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('moderate');
  const [arr, setArr] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [healthScore, setHealthScore] = useState('75');

  const canSubmit = company.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      name: name.trim(),
      company: company.trim(),
      accountExecutive: accountExecutive.trim(),
      ctaType,
      riskLevel,
      arr: arr ? Number(arr) : undefined,
      renewalDate: renewalDate ? new Date(renewalDate).toISOString() : '',
      healthScore: healthScore ? Number(healthScore) : 0,
      closed: false,
    });
    onClose();
  };

  return (
    <Modal title="Add customer" onClose={onClose}>
      <div className="form-row">
        <div className="form-field">
          <label>Primary contact</label>
          <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="form-field">
          <label>Company</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label>Account Executive</label>
          <input value={accountExecutive} onChange={(e) => setAccountExecutive(e.target.value)} />
        </div>
        <div className="form-field">
          <label>CTA type</label>
          <select value={ctaType} onChange={(e) => setCtaType(e.target.value as CtaType)}>
            {CTA_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label>Risk level</label>
          <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}>
            {RISK_LEVELS.map((level) => (
              <option key={level} value={level}>
                {RISK_LEVEL_LABELS[level]}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Renewal date</label>
          <input type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label>Health score (0–100)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={healthScore}
            onChange={(e) => setHealthScore(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>ARR</label>
          <input type="number" value={arr} onChange={(e) => setArr(e.target.value)} />
        </div>
      </div>
      <div className="form-actions">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          Add customer
        </Button>
      </div>
    </Modal>
  );
}
