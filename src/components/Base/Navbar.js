import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { doLogout } from '../../state/app/app.thunks'
import { Languages } from '../../constants/index'
/**
 * Component for Rendering the NavBar
 * @param user
 *
 */
export default function NavBar ({ user }) {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <Navbar expand="lg" variant="dark" className="site-header">
      <Navbar.Brand role={'button'} onClick={() => history.push('/dashboard')}>
        {t('Navbar.mindLogger')}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => history.push('/applet')}>
            {t('Navbar.applets')}
          </Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          <UserInfoDropdown user={user} />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const UserInfoDropdown = ({ user }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()

  const logOut = () => {
    dispatch(doLogout())
  }

  if (user) {
    return (
      <React.Fragment>
        <div className="App container">
          <LanguageDropdown />
        </div>

        <NavDropdown
          title={user.firstName}
          id="basic-nav-dropdown"
          className="ml-auto"
        >
          <NavDropdown.Item onClick={() => history.push('/changepassword')}>
            {t('Navbar.settings')}
          </NavDropdown.Item>
          <NavDropdown.Item onClick={() => history.push('/profile')}>
            {t('Navbar.profile')}
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={logOut}>
            {t('Navbar.logOut')}
          </NavDropdown.Item>
        </NavDropdown>
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <LanguageDropdown />
        <Nav.Link onClick={() => history.push('/login')}>
          {t('Navbar.logIn')}
        </Nav.Link>
      </React.Fragment>
    )
  }
}

const LanguageDropdown = () => {
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState(i18n.language || Languages.ENGLISH)

  useEffect(() => changeLanguage(i18n.language), [i18n.language])

  const changeLanguage = (lang) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  return (
    <DropdownButton
      alignRight
      title={
        language === Languages.ENGLISH
          ? t('Navbar.english')
          : t('Navbar.french')
      }
      id="dropdown-menu-align-right"
      onSelect={changeLanguage}
    >
      <Dropdown.Item eventKey={Languages.ENGLISH}>
        {t('Navbar.english')}
      </Dropdown.Item>
      <Dropdown.Item eventKey={Languages.FRENCH}>
        {t('Navbar.french')}
      </Dropdown.Item>
    </DropdownButton>
  )
}
