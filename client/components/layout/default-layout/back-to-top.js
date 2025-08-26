import React, { useEffect, useState } from 'react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 滾動事件處理
  const toggleVisibility = () => {
    if (window.pageYOffset > 20) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 點擊返回頂部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 綁定滾動事件
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="btn topOn position-fixed bottom-0 end-0 m-4 text-white"
      >
        ^
      </button>
    )
  );
};

export default BackToTopButton;
