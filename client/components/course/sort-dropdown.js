import { useState, useRef, useEffect } from 'react';
import styles from './sort-dropdown.module.scss';

const SortDropdown = ({ onSortChange }) => {
  const [selectedOption, setSelectedOption] = useState("熱門課程");
  const [isOpen, setIsOpen] = useState(false);
  const options = ["熱門課程", "最新課程", "價格由高到低", "價格由低到高"];
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSortChange(option);
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
        {selectedOption}
      </button>
      {isOpen && (
        <ul className={`dropdown-menu ${styles['dropdown-menu']}`} style={{ display: 'block' }}>
          {options.map((option, index) => (
            <li key={index}>
              <a
                href="#"
                className={`dropdown-item ${styles['dropdown-item']} ${
                  option === selectedOption ? styles['selected'] : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(option);
                }}
              >
                {option}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;