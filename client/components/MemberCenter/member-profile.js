import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCakeCandles,
  faEnvelope,
  faVenusMars,
  faPhone,
  faMapLocation,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import styles from './member-profile.module.scss';
//會員資料元件
export default function MemberProfileForm({ memberData, isEditing, handleChange, handleSave, toggleEdit }) {
  return (
    <div className="container overflow-hidden">
      <div className={`member-profile ${styles.contentArea}`}>
        <div className="d-flex justify-content-between align-items-center px-lg-5 mt-3">
          <h4 className="fontDarkBrown h4Bold">{memberData.member_name}貴賓，歡迎回來!</h4>
          <button className="btn btn-outline-primary" onClick={toggleEdit}>
            <FontAwesomeIcon icon={faEdit} /> {isEditing ? '取消' : '修改'}
          </button>
        </div>

        <div className="row px-lg-5 mt-2">
          <div className="col-12">
            <form onSubmit={handleSave}>
              <div className="row">
                {/* 會員帳號 */}
                <div className="col-md-6 mb-3">
                  <div className="fontDarkBrown">會員帳號</div>
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span className={`input-group-text ${styles.inputGroupText}`}>
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <div className={`form-control ${styles.formControl} ${styles.labelAccount}`}>
                      {memberData.account}
                    </div>
                  </div>
                </div>

                {/* 會員姓名 */}
                <div className="col-md-6 mb-3">
                  <label className={`fontDarkBrown ${styles.label}`} htmlFor='member-name-label'>會員姓名</label>
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span className={`input-group-text ${styles.inputGroupText}`}>
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        className={`form-control ${styles.formControl}`}
                        name="member_name"
                        value={memberData.member_name}
                        onChange={handleChange}
                        id="member-name-label"
                      />
                    ) : (
                      <div className={`form-control ${styles.formControl}`}>{memberData.member_name}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                {/* 電子郵件 */}
                <div className="col-md-6 mb-3">
                  <label className={`fontDarkBrown ${styles.label}`} htmlFor='member-email-label'>電子郵件</label>
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span className={`input-group-text ${styles.inputGroupText}`}>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    {isEditing ? (
                      <input
                        type="email"
                        className={`form-control ${styles.formControl}`}
                        name="email"
                        value={memberData.email}
                        onChange={handleChange}
                        id="member-email-label"
                      />
                    ) : (
                      <div className={`form-control ${styles.formControl}`}>{memberData.email}</div>
                    )}
                  </div>
                </div>

                {/* 性別 */}
                <div className="col-md-6 mb-3">
                  <label className={`fontDarkBrown ${styles.label}`} htmlFor='member-gender-label'>性別</label>
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span className={`input-group-text ${styles.inputGroupText}`}>
                      <FontAwesomeIcon icon={faVenusMars} />
                    </span>
                    {isEditing ? (
                      <select
                        className={`form-control ${styles.formControl}`}
                        name="gender"
                        value={memberData.gender || ''}
                        onChange={handleChange}
                        id="member-gender-label"
                      >
                        <option value="">未指定</option>
                        <option value="男性">男性</option>
                        <option value="女性">女性</option>
                      </select>
                    ) : (
                      <div className={`form-control ${styles.formControl}`}>{memberData.gender}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                {/* 會員生日 */}
                <div className="col-md-6 mb-3">
                  <label className={`fontDarkBrown ${styles.label}`} htmlFor='member-birthdate-label'>會員生日</label>
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span className={`input-group-text ${styles.inputGroupText}`}>
                      <FontAwesomeIcon icon={faCakeCandles} />
                    </span>
                    {isEditing ? (
                      <input
                        type="date"
                        className={`form-control ${styles.formControl}`}
                        name="birthdate"
                        value={memberData.birthdate}
                        onChange={handleChange}
                        id="member-birthdate-label"
                      />
                    ) : (
                      <div className={`form-control ${styles.formControl}`}>{memberData.birthdate}</div>
                    )}
                  </div>
                </div>

                {/* 聯絡電話 */}
                <div className="col-md-6 mb-3">
                  <label className={`fontDarkBrown ${styles.label}`} htmlFor='member-phone-label'>聯絡電話</label>
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span className={`input-group-text ${styles.inputGroupText}`}>
                      <FontAwesomeIcon icon={faPhone} />
                    </span>
                    {isEditing ? (
                      <input
                        type="tel"
                        className={`form-control ${styles.formControl}`}
                        name="phone"
                        value={memberData.phone}
                        onChange={handleChange}
                        id="member-phone-label"
                      />
                    ) : (
                      <div className={`form-control ${styles.formControl}`}>{memberData.phone}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                {/* 會員寄送地址 */}
                <label className={`fontDarkBrown ${styles.label}`} htmlFor='member-address-label'>會員寄送地址</label>
                <div className={`input-group ${styles.customInputGroup}`}>
                  <span className={`input-group-text ${styles.inputGroupText}`}>
                    <FontAwesomeIcon icon={faMapLocation} />
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      className={`form-control ${styles.formControl}`}
                      name="address"
                      value={memberData.address}
                      onChange={handleChange}
                      id="member-address-label"
                    />
                  ) : (
                    <div className={`form-control ${styles.formControl}`}>{memberData.address}</div>
                  )}
                </div>
              </div>

              {isEditing && (
                <button type="submit" className={`btn ${styles.submitButton}`}>
                  保存修改
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
