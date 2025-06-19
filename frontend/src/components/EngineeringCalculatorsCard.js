import React, { useState } from "react";
import "./EngineeringCalculatorsCard.css";

// --- RC Time Constant Calculator ---
const RCTimeConstantCalculator = () => {
  const [resistance, setResistance] = useState("");
  const [capacitance, setCapacitance] = useState("");
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const R = parseFloat(resistance);
    const C = parseFloat(capacitance);
    if (!isNaN(R) && !isNaN(C) && R > 0 && C > 0) {
      setResult(R * C);
    } else {
      setResult("Please enter valid positive numbers.");
    }
  };

  return (
    <div className="calc-modal-inner">
      <h3>RC Time Constant Calculator</h3>
      <form onSubmit={calculate} className="calc-form">
        <label>
          Resistance (Ω):
          <input
            type="number"
            step="any"
            min="0"
            value={resistance}
            onChange={e => setResistance(e.target.value)}
            required
          />
        </label>
        <label>
          Capacitance (F):
          <input
            type="number"
            step="any"
            min="0"
            value={capacitance}
            onChange={e => setCapacitance(e.target.value)}
            required
          />
        </label>
        <button type="submit">Calculate</button>
      </form>
      {result !== null && (
        <div className="calc-result">
          {typeof result === "number"
            ? <>Time Constant (τ) = <strong>{result}</strong> seconds</>
            : <span style={{ color: 'red' }}>{result}</span>
          }
        </div>
      )}
      <div className="calc-desc">
        <small>
          Formula: τ = R × C<br />
          τ = Time constant (seconds), R = Resistance (ohms), C = Capacitance (farads)
        </small>
      </div>
    </div>
  );
};

// --- Op-amp Gain Calculator (Non-inverting) ---
const OpAmpGainCalculator = () => {
  const [rf, setRf] = useState("");
  const [rin, setRin] = useState("");
  const [gain, setGain] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const Rf = parseFloat(rf);
    const Rin = parseFloat(rin);
    if (!isNaN(Rf) && !isNaN(Rin) && Rin > 0) {
      setGain(1 + Rf / Rin);
    } else {
      setGain("Please enter valid positive numbers (Rin ≠ 0).");
    }
  };

  return (
    <div className="calc-modal-inner">
      <h3>Op-amp Gain Calculator (Non-inverting)</h3>
      <form onSubmit={calculate} className="calc-form">
        <label>
          Feedback Resistor (Rf, Ω):
          <input
            type="number"
            step="any"
            min="0"
            value={rf}
            onChange={e => setRf(e.target.value)}
            required
          />
        </label>
        <label>
          Input Resistor (Rin, Ω):
          <input
            type="number"
            step="any"
            min="0"
            value={rin}
            onChange={e => setRin(e.target.value)}
            required
          />
        </label>
        <button type="submit">Calculate</button>
      </form>
      {gain !== null && (
        <div className="calc-result">
          {typeof gain === "number"
            ? <>Gain (Av) = <strong>{gain.toFixed(3)}</strong></>
            : <span style={{ color: 'red' }}>{gain}</span>
          }
        </div>
      )}
      <div className="calc-desc">
        <small>
          Formula (Non-inverting): Av = 1 + (Rf / Rin)<br />
          Av = Voltage gain, Rf = Feedback resistor, Rin = Input resistor
        </small>
      </div>
    </div>
  );
};

// --- AC Power Calculator ---
const ACPowerCalculator = () => {
  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [pf, setPf] = useState("");
  const [power, setPower] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const V = parseFloat(voltage);
    const I = parseFloat(current);
    const PF = parseFloat(pf);
    if (!isNaN(V) && !isNaN(I) && !isNaN(PF) && PF >= 0 && PF <= 1) {
      setPower(V * I * PF);
    } else {
      setPower("Please enter valid numbers (Power Factor between 0 and 1).");
    }
  };

  return (
    <div className="calc-modal-inner">
      <h3>AC Power Calculator</h3>
      <form onSubmit={calculate} className="calc-form">
        <label>
          Voltage (V):
          <input
            type="number"
            step="any"
            min="0"
            value={voltage}
            onChange={e => setVoltage(e.target.value)}
            required
          />
        </label>
        <label>
          Current (A):
          <input
            type="number"
            step="any"
            min="0"
            value={current}
            onChange={e => setCurrent(e.target.value)}
            required
          />
        </label>
        <label>
          Power Factor (0–1):
          <input
            type="number"
            step="any"
            min="0"
            max="1"
            value={pf}
            onChange={e => setPf(e.target.value)}
            required
          />
        </label>
        <button type="submit">Calculate</button>
      </form>
      {power !== null && (
        <div className="calc-result">
          {typeof power === "number"
            ? <>Power (P) = <strong>{power}</strong> Watts</>
            : <span style={{ color: 'red' }}>{power}</span>
          }
        </div>
      )}
      <div className="calc-desc">
        <small>
          Formula: P = V × I × PF<br />
          P = Power (Watts), V = Voltage (Volts), I = Current (Amperes), PF = Power Factor
        </small>
      </div>
    </div>
  );
};

// --- Signal-to-Noise Ratio Calculator (dB) ---
const SignalToNoiseRatioCalculator = () => {
  const [signal, setSignal] = useState("");
  const [noise, setNoise] = useState("");
  const [snr, setSnr] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const S = parseFloat(signal);
    const N = parseFloat(noise);
    if (!isNaN(S) && !isNaN(N) && S > 0 && N > 0) {
      setSnr(20 * Math.log10(S / N));
    } else {
      setSnr("Please enter valid positive numbers.");
    }
  };

  return (
    <div className="calc-modal-inner">
      <h3>Signal-to-Noise Ratio Calculator</h3>
      <form onSubmit={calculate} className="calc-form">
        <label>
          Signal Level:
          <input
            type="number"
            step="any"
            min="0"
            value={signal}
            onChange={e => setSignal(e.target.value)}
            required
          />
        </label>
        <label>
          Noise Level:
          <input
            type="number"
            step="any"
            min="0"
            value={noise}
            onChange={e => setNoise(e.target.value)}
            required
          />
        </label>
        <button type="submit">Calculate</button>
      </form>
      {snr !== null && (
        <div className="calc-result">
          {typeof snr === "number"
            ? <>SNR = <strong>{snr.toFixed(3)}</strong> dB</>
            : <span style={{ color: 'red' }}>{snr}</span>
          }
        </div>
      )}
      <div className="calc-desc">
        <small>
          Formula: SNR(dB) = 20 × log₁₀(S / N)<br />
          S = Signal level, N = Noise level
        </small>
      </div>
    </div>
  );
};

const calculators = [
  {
    name: "RC Time Constant Calculator",
    icon: "⏱️",
    component: RCTimeConstantCalculator,
  },
  {
    name: "Op-amp Gain Calculator",
    icon: "🔼",
    component: OpAmpGainCalculator,
  },
  {
    name: "AC Power Calculator",
    icon: "⚡",
    component: ACPowerCalculator,
  },
  {
    name: "Signal-to-Noise Ratio",
    icon: "📈",
    component: SignalToNoiseRatioCalculator,
  },
];

const EngineeringCalculatorsCard = () => {
  const [activeCalc, setActiveCalc] = useState(null);

  return (
    <div className="eng-calc-card">
      <div className="eng-calc-title">Engineering Calculators</div>
      <div className="eng-calc-list-vertical">
        {calculators.map((calc, idx) => (
          <button
            className="eng-calc-item"
            key={idx}
            onClick={() => setActiveCalc(calc)}
            type="button"
          >
            <span className="eng-calc-icon">{calc.icon}</span>
            <span className="eng-calc-label">{calc.name}</span>
          </button>
        ))}
      </div>
      {activeCalc && (
        <div className="eng-calc-modal-bg" onClick={() => setActiveCalc(null)}>
          <div
            className="eng-calc-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="eng-calc-modal-close"
              onClick={() => setActiveCalc(null)}
              title="Close"
            >×</button>
            <activeCalc.component />
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineeringCalculatorsCard;