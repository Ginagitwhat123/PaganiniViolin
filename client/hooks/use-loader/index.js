import { useState, useContext, createContext, useEffect } from 'react';
import { DefaultLoader, LoaderText } from './components';
import { useRouter } from 'next/router';

const LoaderContext = createContext(null);

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const LoaderProvider = ({
  children,
  close = 1.5,
  global = false,
  CustomLoader = DefaultLoader,
}) => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 檢查如果在首頁，則顯示 loading 並等待 3 秒
    if (router.pathname === '/homepage') {
      setShow(true);
      timeout(2 * 1000).then(() => setShow(false));
    }

    const handleChangeStart = (url) => {
      if (global) {
        console.log('Start loading');
        setShow(true);
      }
    };

    const handleChangeEnd = (url) => {
      if (global) {
        const loadingTime = router.pathname === '/homepage' ? 3 * 1000 : close * 1000;
        console.log('End loading');
        timeout(loadingTime).then(() => setShow(false));
      }
    };

    router.events.on('routeChangeStart', handleChangeStart);
    router.events.on('routeChangeComplete', handleChangeEnd);
    router.events.on('routeChangeError', handleChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleChangeStart);
      router.events.off('routeChangeComplete', handleChangeEnd);
      router.events.off('routeChangeError', handleChangeEnd);
    };
  }, [global, close, router.pathname]);

  return (
    <LoaderContext.Provider
      value={{
        showLoader: () => setShow(true),
        hideLoader: () => setShow(false),
        loading: show,
        loader: () => <CustomLoader show={show} />,
        loaderText: (text) => <LoaderText text={text} show={show} />,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader 必須在 LoaderProvider 中使用');
  }
  return context;
};
