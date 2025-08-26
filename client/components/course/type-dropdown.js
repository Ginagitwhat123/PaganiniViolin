import React, { useState, useEffect, useRef } from 'react';
import styles from './type-dropdown.module.scss';

const Dropdown = ({ onTypeChange }) => {
  const [selectedType, setSelectedType] = useState('所有課程');
  const [isOpen, setIsOpen] = useState(false);
  const types = ['所有課程', '小提琴', '中提琴', '大提琴'];
  const dropdownRef = useRef(null);

  const handleSelect = (type) => {
    setSelectedType(type);
    setIsOpen(false);
    onTypeChange(type);
  };

  // 點擊外部時關閉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`dropdown ${styles['sort-dropdown']}`}>
      <button
        className={`btn dropdown-toggle ${styles['sort-button']}`}
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedType}
      </button>
      {isOpen && (
        <ul className={`dropdown-menu ${styles['dropdown-menu']}`} style={{ display: 'block' }}>
          {types.map((type, index) => (
            <li key={index}>
              <a
                href="#"
                className={`dropdown-item ${styles['dropdown-item']} ${
                  type === selectedType ? styles['selected'] : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(type);
                }}
              >
                {type}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;