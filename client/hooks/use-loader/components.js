// https://github.com/Gamote/lottie-react
// import Lottie from 'lottie-react'
import catAnimation from '@/assets/loader-cat.json';
import nikeAnimation from '@/assets/loader-nike.json';
import Loading from '@/components/common/loading/loading'; // 引入您的自訂 Loading 動畫

// 預設的 Loader
export function DefaultLoader({ show = false }) {
  return (
    <div className={`semi-loader ${show ? '' : 'semi-loader--hide'}`}></div>
  );
}

// 文字型 Loader
export function LoaderText({ text = 'loading', show = false }) {
  return (
    <div className={`loading-text-bg ${show ? '' : 'loading-text--hide'}`}>
      <div className={`loading-text ${show ? '' : 'loading-text--hide'}`}>
        {text}...
      </div>
    </div>
  );
}

// 使用 lottie-react 的 CatLoader
export function CatLoader({ show = false }) {
  return (
    <div className={`cat-loader-bg ${show ? '' : 'cat-loader--hide'}`}>
      {/* <Lottie
        className={`cat-loader ${show ? '' : 'cat-loader--hide'}`}
        animationData={catAnimation}
      /> */}
    </div>
  );
}

// 使用 lottie-react 的 NikeLoader
export function NikeLoader({ show = false }) {
  return (
    <div className={`nike-loader-bg ${show ? '' : 'nike-loader--hide'}`}>
      {/* <Lottie
        className={`nike-loader ${show ? '' : 'nike-loader--hide'}`}
        animationData={nikeAnimation}
      /> */}
    </div>
  );
}

// 使用自訂 Loading 動畫的 CustomLoader
export function CustomLoader({ show = false }) {
  return <Loading show={show} />;
}

// 空的 Loader，用於不需要動畫的情況
export function NoLoader({ show = false }) {
  return <></>;
}
