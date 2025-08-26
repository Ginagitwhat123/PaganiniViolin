import React from 'react';
export default function Footer() {
    return (
      <footer className="footer" style={{ background: '#5A5650', color: 'white' }}>
        <div className="container">
          <div className="row row-cols-5 py-5">
            <div className="col">
              <h3 className="pb-2">Paganini</h3>
              <ul className="nav flex-column">
                {/* Instagram */}
                <li className="nav-item mb-2 d-flex align-items-center">
                  <div className="icon-box d-flex align-items-center justify-content-center" style={{
                    border: 'solid 1px white',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    textAlign: 'center',
                    lineHeight: '36px',
                    fontSize: '16px'
                  }}>
                    <i className="fa-brands fa-instagram text-white"></i>
                  </div>
                  <a href="#" className="nav-link p-0 text-white ms-2">Instagram</a>
                </li>
  
                {/* Facebook */}
                <li className="nav-item mb-2 d-flex align-items-center">
                  <div className="icon-box d-flex align-items-center justify-content-center" style={{
                    border: 'solid 1px white',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    textAlign: 'center',
                    lineHeight: '36px',
                    fontSize: '16px'
                  }}>
                    <i className="fa-brands fa-facebook text-white"></i>
                  </div>
                  <a href="#" className="nav-link p-0 text-white ms-2">Facebook</a>
                </li>
              </ul>
            </div>
  
            <div className="col">
              {/* 空列 */}
            </div>
  
            <div className="col">
              <h5 className="pb-2">服務</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">提琴專區</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">專業課程</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">部落格</a></li>
              </ul>
            </div>
  
            <div className="col">
              <h5 className="pb-2">關於帕格尼尼</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">關於</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">門市資訊</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">聯絡我們</a></li>
              </ul>
            </div>
  
            <div className="col">
              <h5 className="pb-2">最新消息</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">專欄</a></li>
              </ul>
            </div>
          </div>
  
          <div className="d-flex justify-content-between py-5">
            <p>© 2022 Company, Inc. All rights reserved.</p>
            <ul className="list-unstyled d-flex">
              <li className="ms-3"><a className="link-dark" href="#"><i className="fa-brands fa-twitter"></i></a></li>
              <li className="ms-3"><a className="link-dark" href="#"><i className="fa-brands fa-instagram"></i></a></li>
              <li className="ms-3"><a className="link-dark" href="#"><i className="fa-brands fa-facebook"></i></a></li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }
  