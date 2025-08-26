import React, { useState, useContext, createContext } from 'react'

const BreadcrumbContext = createContext(null)

export const BreadcrumbProvider = ({ children }) => {
  // set title
  const [subtitle, setSubTitle] = useState('')

  return (
    <BreadcrumbContext.Provider
      value={{
        subtitle,
        setSubTitle,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  )
}

export const useNameAsBreadcrumb = () => useContext(BreadcrumbContext)
