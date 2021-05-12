import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { userInfoSelector } from '../../state/user/user.selectors'
import Avatar from '../Base/Avatar'

/**
 *
 * Component to display User Profile
 * @constructor
 */
const Profile = () => {
  const { t } = useTranslation()
  const user = useSelector(state => userInfoSelector(state))

  return (
    <div className="my-3 h-100">
      <div className="heading">
      <Avatar />
        <h1>
          {user?.firstName} {user?.lastName}
        </h1>
      </div>
      <hr/>
      <div>
       {t('Profile.title')}
      </div>

      <div>
       {t('Profile.description')}
      </div>
    </div>
  )
}

export default Profile;