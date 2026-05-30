"use client";

import PhoneInputBase from "react-phone-number-input";
import "react-phone-number-input/style.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function PhoneInput({ value, onChange, placeholder }: Props) {
  return (
    <>
      <PhoneInputBase
        international
        defaultCountry="FR"
        countryCallingCodeEditable={false}
        value={value}
        onChange={(v) => onChange(v || "")}
        placeholder={placeholder || "6 12 34 56 78"}
        className="northstone-phone-input"
      />

      <style jsx global>{`
        .northstone-phone-input {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          border: 1px solid rgba(26, 35, 50, 0.18);
          border-radius: 6px;
          padding: 2px 12px;
          background-color: #fff;
          transition: border-color 0.2s;
        }

        .northstone-phone-input:focus-within {
          border-color: #B8985A;
        }

        .northstone-phone-input .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 0;
          margin-right: 4px;
          border-right: 1px solid rgba(26, 35, 50, 0.12);
          padding-right: 10px;
        }

        .northstone-phone-input .PhoneInputCountryIcon {
          width: 22px;
          height: 16px;
          box-shadow: 0 0 0 1px rgba(26, 35, 50, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .northstone-phone-input .PhoneInputCountrySelectArrow {
          color: #6B6B6B;
          opacity: 0.8;
          margin-left: 2px;
          width: 0.4em;
          height: 0.4em;
        }

        .northstone-phone-input .PhoneInputCountrySelect {
          cursor: pointer;
        }

        .northstone-phone-input .PhoneInputInput {
          flex: 1;
          border: none;
          outline: none;
          padding: 10px 0;
          font-size: 14px;
          color: #1A2332;
          background: transparent;
          font-family: inherit;
        }

        .northstone-phone-input .PhoneInputInput::placeholder {
          color: rgba(26, 35, 50, 0.3);
        }
      `}</style>
    </>
  );
}